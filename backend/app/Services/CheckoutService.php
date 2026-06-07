<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CartSnapshotDTO;
use App\Exceptions\CartEmptyException;
use App\Exceptions\CartOwnershipException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\MissingDefaultAddressException;
use App\Models\Cart;
use App\Models\Checkout;
use App\Models\CartItem;
use App\Repositories\Contracts\ICartRepository;
use App\Repositories\Contracts\ICheckoutRepository;
use App\Repositories\Contracts\IProductItemRepository;
use App\Repositories\Contracts\IUserRepository;
use Stripe\StripeClient;

final class CheckoutService
{
     // Stripe session TTL. 30 minutes gives users enough time
    // to complete payment without holding stock indefinitely.
    private const SESSION_TTL_MINUTES = 30;
 
    public function __construct(
        private readonly ICartRepository $cartRepository,
        private readonly IUserRepository $userRepository,
        private readonly ICheckoutRepository $checkoutRepository,
        private readonly IProductItemRepository $productRepository,
        private readonly StripeClient $stripe,
    ) {}
 
    /**
     * Initiate a checkout session.
     *
     * Returns the Checkout model with the Stripe session URL attached
     * so the controller can redirect the user.
     *
     * Transaction boundary: the Stripe API call is intentionally
     * OUTSIDE the DB transaction. Stripe calls are slow (~200ms)
     * and non-rollbackable. If we held a DB transaction open during
     * the Stripe call, we'd block concurrent checkouts for 200ms+
     * per request, and a Stripe timeout would leave the transaction
     * in a broken state. Instead:
     *   1. Validate everything inside a transaction (fast).
     *   2. Call Stripe outside the transaction (slow, external).
     *   3. Update the checkout record with the session ID.
     *   4. Reserve stock (atomic increments, no transaction needed).
     */
    public function initiate(int $userId, string $idempotencyKey): Checkout
    {
        $existingCheckout = $this->checkoutRepository->findByIdempotencyKey($idempotencyKey);

        if ($existingCheckout) {
            return $existingCheckout;
        }
        // ── Step 1: Load and validate the cart ─────────────────
        $cart = $this->cartRepository->findActiveCartWithItems($userId);

 
        if (!$cart) {
            throw new CartOwnershipException($userId);
        }
 
        if ($cart->items->isEmpty()) {
            throw new CartEmptyException();
        }
        $user = $this->userRepository->find($userId);
        $defaultAddress = $user->defaultAddress;

        if (!$defaultAddress) {
            throw new MissingDefaultAddressException();
        }

        // ── Step 2: Validate stock (read-only, no locks yet) ───
        // We do a quick optimistic check before touching Stripe.
        // The authoritative check happens inside the webhook job
        // with a pessimistic lock. This check is a fast fail for
        // obviously unavailable items.
        foreach ($cart->items as $item) {
            if (!$item->productItem) {
                throw new InsufficientStockException(
                    $item->product_item_id, 
                    'Unknown (deactivated)', 
                    $item->quantity, 
                    0
                );
            }
 
            if ($item->productItem->availableQty() < $item->quantity) {
                throw new InsufficientStockException(
                    $item->product_item_id,
                    $item->productItem->product->name,
                    $item->quantity,
                    $item->productItem->availableQty()
                );
            }
        }
 
        // ── Step 3: Build the cart snapshot ───────────────────
        // The shipping fee is recalculated here (same logic as
        // preview) so the snapshot captures the definitive amount.
        $shippingFee = $this->calculateShippingFee($cart);
        $snapshot    = CartSnapshotDTO::fromCart($cart, $shippingFee);
        $expiresAt   = now()->addMinutes(self::SESSION_TTL_MINUTES);
 
        // ── Step 4: Persist the checkout record ───────────────
        // We store the snapshot BEFORE calling Stripe. If Stripe
        // fails, we have a checkout record in 'pending' state with
        // no session ID. The cleanup job will expire it gracefully.
        $checkout = $this->checkoutRepository->create([
            'cart_id'=> $cart->id,
            'user_id'         => $userId,
            'idempotency_key' => $idempotencyKey,
            'cart_snapshot'   => $snapshot->toArray(),
            'status'          => Checkout::STATUS_PENDING,
            'expires_at'      => $expiresAt,
        ]);
 
        // ── Step 5: Create Stripe Checkout Session ────────────
        // Each cart item maps to a Stripe line item. We use the
        // snapshot amounts, not live prices, so the Stripe total
        // matches exactly what the user saw in the preview.
        $lineItems = array_map(
            fn ($item) => [
                'price_data' => [
                    'currency'     => $snapshot->currency,
                    'unit_amount'  => (int) bcmul($item->unitPrice, '100', 0),
                    'product_data' => [
                        'name' => $item->productName,
                    ],
                ],
                'quantity' => $item->quantity,
            ],
            $snapshot->items
        );
 
        // Add shipping as a separate line item if applicable.
        if (bccomp($snapshot->shippingFee, '0.00', 2) > 0) {
            $lineItems[] = [
                'price_data' => [
                    'currency'     => $snapshot->currency,
                    'unit_amount'  => (int) bcmul($snapshot->shippingFee, '100', 0),
                    'product_data' => ['name' => 'Shipping'],
                ],
                'quantity' => 1,
            ];
        }
 
        $stripeSession = $this->stripe->checkout->sessions->create([
            'mode'        => 'payment',
            'line_items'  => $lineItems,
            'success_url' => config('app.frontend_url') . '/checkout/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => config('app.frontend_url') . '/checkout/cancel',
            'expires_at'  => $expiresAt->timestamp,
            'metadata'    => [
                // Attach our checkout ID so the webhook can find this record.
                'checkout_id' => $checkout->id,
                'user_id'     => $userId,
            ],
            // Pass idempotency key to Stripe so duplicate requests to
            // this endpoint return the same session.
        ], [
            'idempotency_key' => $idempotencyKey,
        ]);
 
        // ── Step 6: Attach Stripe session ID to checkout ──────
        $checkout->update([
            'stripe_session_id' => $stripeSession->id,
        ]);
 
        // ── Step 7: Soft-reserve stock ────────────────────────
        // Increment reserved_qty for each item. This reduces
        // available-to-sell for other users immediately.
        // These are atomic increments — no transaction needed.
        foreach ($snapshot->items as $item) {
            $this->productRepository->incrementReservedQty(
                $item->productItemId,
                $item->quantity
            );
        }
 
        // ── Step 8: Lock the cart ─────────────────────────────
        // Prevents the user from modifying the cart after
        // the Stripe session has been created.
        $this->cartRepository->lockCart($cart);
 
        // Refresh so the caller gets the full model with session ID.
        return $checkout->fresh();
    }
 
    private function calculateShippingFee(Cart $cart): string
    {
        $subtotal = $cart->items->reduce(
            fn (string $carry, CartItem $item)
                => bcadd($carry, bcmul((string) $item->unit_price, (string) $item->quantity, 2), 2),
            '0.00'
        );
 
        return bccomp($subtotal, '100.00', 2) >= 0 ? '0.00' : '9.99';
    }
}

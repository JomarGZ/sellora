<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Order;
use Stripe\Checkout\Session;
use Stripe\Stripe;

final class StripeService
{
    public function createCheckoutSession(Order $order): string
    {
        Stripe::setApiKey(config('stripe.secret_key'));

        // Build line items from order items
        $lineItems = $order->items->map(function ($item) {
            return [
                'price_data' => [
                    'currency' => 'php',
                    'product_data' => [
                        'name' => $item->product_name,
                        'metadata' => [
                            'sku' => $item->sku,
                            'product_item_id' => $item->product_item_id,
                        ],
                    ],
                    'unit_amount' => (int) round((float) ($item->price) * 100), // Convert to centavos
                ],
                'quantity' => $item->quantity,
            ];
        })->toArray();

        // Add shipping fee as a separate line item (if non-zero)
        if ((float) ($order->shipping_fee) > 0) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'php',
                    'product_data' => [
                        'name' => ucfirst($order->shippingMethod->name ?? 'Shipping'),
                    ],
                    'unit_amount' => (int) round((float) ($order->shipping_fee) * 100),
                ],
                'quantity' => 1,
            ];
        }

        $address = $order->address;

        $session = Session::create([
            'payment_method_types' => ['card'],
            'mode' => 'payment',
            'line_items' => $lineItems,

            // Pre-fill customer info
            'customer_email' => $order->user->email ?? null,

            // Pre-fill shipping address
            'shipping_address_collection' => [
                'allowed_countries' => ['PH'],
            ],
            'shipping_options' => [
                [
                    'shipping_rate_data' => [
                        'type' => 'fixed_amount',
                        'fixed_amount' => [
                            'amount' => 0, // Already included in line items above
                            'currency' => 'php',
                        ],
                        'display_name' => ucfirst($order->shippingMethod->name ?? 'Shipping'),
                        'delivery_estimate' => [
                            'minimum' => [
                                'unit' => 'business_day',
                                'value' => $order->shippingMethod->estimated_days ?? 7,
                            ],
                            'maximum' => [
                                'unit' => 'business_day',
                                'value' => $order->shippingMethod->estimated_days ?? 7,
                            ],
                        ],
                    ],
                ],
            ],

            // Pass order metadata for webhook handling
            'metadata' => [
                'order_id' => $order->id,
                'payment_id' => $order->payment->id,
            ],

            // Redirect URLs
            'success_url' => route('api.v1.checkout.verifySession').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('api.v1.checkout.cancel', ['order' => $order->id]),
        ]);

        // Optionally store the session ID on the payment record
        $order->payment->update(['transaction_id' => $session->id]);

        return $session->url;
    }
}

<?php

namespace App\Services;

use App\Enums\RefundReasonType;
use App\Models\Checkout;
use App\Repositories\Contracts\ICheckoutRepository;
use Illuminate\Support\Facades\Log;
use Stripe\StripeClient;

class RefundService
{
     public function __construct(
        private readonly StripeClient $stripe,
        private readonly ICheckoutRepository $checkoutRepository,
    ) {}
 
    /**
     * Issue a full refund for a payment intent and mark the
     * checkout as refunded.
     *
     * WHY full refund: if we can't fulfil the order, the customer
     * gets all their money back. No partial refunds here —
     * we only refund when the entire order fails stock validation.
     */
    public function refundPayment(Checkout $checkout, string $paymentIntentId, ?RefundReasonType $reasonType = null): void
    {
        $stripeData = [
            'payment_intent' => $paymentIntentId,
            'metadata'       => [
                'checkout_id'    => $checkout->id,
                'internal_reason' => $reasonType?->value,
            ],
        ];

        if ($reasonType) {
            $stripeReason = $this->mapToStripeReason($reasonType);
            $stripeData['reason'] = $reasonType;
        }
        try {
            $this->stripe->refunds->create($stripeData);
 
            $this->checkoutRepository->markFailed($checkout, $reasonType->value);
 
            Log::info('Refund issued successfully', [
                'checkout_id'       => $checkout->id,
                'payment_intent_id' => $paymentIntentId,
                'reason'            => isset($stripeReason) ? $stripeReason : null,
            ]);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            // Log and re-throw. The job will retry, which means Stripe
            // will see a duplicate refund request. Stripe handles this
            // idempotently — a second refund attempt for the same payment
            // intent returns the existing refund object.
            Log::error('Failed to issue Stripe refund', [
                'checkout_id'       => $checkout->id,
                'payment_intent_id' => $paymentIntentId,
                'stripe_error'      => $e->getMessage(),
            ]);
 
            throw $e;
        }
    }

    public function mapToStripeReason(RefundReasonType $type): string
    {
        return match($type) {
            RefundReasonType::FRAUD => 'fraudulent',
            RefundReasonType::CUSTOMER_REQUEST => 'requested_by_customer',
            RefundReasonType::DUPLICATE => 'duplicate',
        };
    }
}

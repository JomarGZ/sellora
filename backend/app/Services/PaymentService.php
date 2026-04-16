<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\Contracts\IPaymentRepository;

final class PaymentService
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        private readonly IPaymentRepository $repository
    ) {}

    public function createPayment(int $orderId, float $amount): void
    {
        $this->repository->createPayment([
            'order_id' => $orderId,
            'payment_method' => 'card',
            'payment_provider' => 'stripe',
            'amount' => $amount,
            'stripe_session_id' => null,
            'status' => 'pending',
        ]);
    }
}

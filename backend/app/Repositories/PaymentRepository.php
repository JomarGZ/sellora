<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Payment;
use App\Repositories\Contracts\IPaymentRepository;

final class PaymentRepository extends BaseRepository implements IPaymentRepository
{
    public function __construct(Payment $payment)
    {
        parent::__construct($payment);
    }

    public function createPayment(array $data): Payment
    {
        return $this->model->create($data);
    }
}

<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Payment;

interface IPaymentRepository
{
    public function createPayment(array $data): Payment;
}

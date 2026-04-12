<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Order;

interface IOrderRepository
{
    public function createOrder(array $data): Order;
}

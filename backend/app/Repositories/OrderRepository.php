<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Order;
use App\Repositories\Contracts\IOrderRepository;

final class OrderRepository extends BaseRepository implements IOrderRepository
{
    public function __construct(Order $order)
    {
        parent::__construct($order);
    }

    public function createOrder(array $data): Order
    {
        return $this->model->create($data);
    }
}

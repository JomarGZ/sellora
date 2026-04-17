<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\OrderItem;
use App\Repositories\Contracts\IOrderItemRepository;

final class OrderItemRepository extends BaseRepository implements IOrderItemRepository
{
    public function __construct(OrderItem $orderItem)
    {
        parent::__construct($orderItem);
    }

    public function createOrderItems(array $items): void
    {
        $this->model->insert($items);
    }
}

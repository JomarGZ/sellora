<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;

final class OrderRepository extends BaseRepository
{
    public function __construct(Order $order)
    {
        parent::__construct($order);
    }


    public function getPaginatedUserOrders(int $userId, ?OrderStatus $status = null, int $perPage = 2)
    {
        return $this->model->query()
            ->where('user_id', $userId)
            ->with(['items.productItem.images','items.productItem.attributeValues', 'items.review', 'items.productItem.product'])
            ->filterByStatus($status)
            ->latest()
            ->paginate($perPage);
    }

}

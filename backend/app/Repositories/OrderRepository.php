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

    public function findByIdempotencyKey(string $key, int $userId): ?Order
    {
        return $this->model->query()->where('idempotency_key', $key)
            ->where('user_id', $userId)
            ->with(['items', 'address', 'payment', 'shippingMethod', 'status'])
            ->first();
    }

    public function updateStatus(int $orderId, int $statusId): void
    {
        Order::where('id', $orderId)->update(['order_status_id' => $statusId]);
    }

    public function findWithItems(int $orderId): Order
    {
        return Order::with('items')->findOrFail($orderId);
    }
}

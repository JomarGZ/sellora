<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Repositories\Contracts\IOrderRepository;

final class OrderRepository extends BaseRepository
{
    public function __construct(Order $order)
    {
        parent::__construct($order);
    }

    public function findByIdempotencyKey(string $key): ?Order
    {
        return Order::with('payment')
            ->where('idempotency_key', $key)
            ->first();
    }

    public function createItems(int $orderId, array $items): void
    {
        $rows = collect($items)->map(fn($i) => [
            'order_id'        => $orderId,
            'product_name'    => $i['product_name'],
            'sku'             => $i['sku'],
            'product_item_id' => $i['product_item_id'],
            'quantity'        => $i['quantity'],
            'price'           => $i['price'],
        ])->toArray();

        OrderItem::insert($rows);
    }
}

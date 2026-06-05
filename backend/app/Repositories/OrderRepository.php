<?php

declare(strict_types=1);

namespace App\Repositories;

use App\DTOs\CartSnapshotDTO;
use App\DTOs\CartSnapshotItemDTO;
use App\Models\Order;
use App\Models\OrderItem;
use App\Repositories\Contracts\IOrderRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class OrderRepository extends BaseRepository implements IOrderRepository
{
    public function __construct(Order $order)
    {
        parent::__construct($order);
    }

   public function createFromSnapshot(
        string          $checkoutId,
        string          $userId,
        string          $paymentIntentId,
        CartSnapshotDTO $snapshot,
    ): Order {
        // Create the order header row.
        $order = $this->model->create([
            'checkout_id'              => $checkoutId,
            'user_id'                  => $userId,
            'stripe_payment_intent_id' => $paymentIntentId,
            'items_snapshot'           => $snapshot->toArray(),
            'subtotal'                 => $snapshot->subtotal,
            'shipping_fee'             => $snapshot->shippingFee,
            'total'                    => $snapshot->total,
            'currency'                 => $snapshot->currency,
            'status'                   => Order::STATUS_CONFIRMED,
        ]);
 
        // Create denormalized line items from snapshot.
        // We do NOT re-read from products here — the snapshot is the
        // authoritative record of what was purchased at what price.
        $lineItems = array_map(
            fn (CartSnapshotItemDTO $item) => [
                'order_id'     => $order->id,
                'product_item_id'   => $item->productItemId,
                'product_name' => $item->productName,
                'product_sku'  => $item->productSku,
                'attributes'   => $item->attributes,
                'image'        => $item->productItemImageUrl,
                'quantity'     => $item->quantity,
                'unit_price'   => $item->unitPrice,
                'line_total'   => $item->lineTotal,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            $snapshot->items
        );
        
 
        // Bulk insert is significantly faster than N individual inserts.
        OrderItem::insert($lineItems);
 
        return $order;
    }

    public function updateStatus(Order $order, string $newStatus): void
    {
        $order->update(['status' => $newStatus]);
    }

    public function paginateForUser(
        string $userId,
        int    $perPage = 15,
        array  $filters = [],
    ): LengthAwarePaginator {
        $query = Order::query()
            ->where('user_id', $userId)
            ->with('items.productItem')
            ->latest(); // created_at DESC — most recent orders first
 
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
 
        return $query->paginate($perPage);
    }

    public function findForUserWithItems(string $orderId, string $userId): ?Order
    {
        return Order::query()
            ->where('id', $orderId)
            ->where('user_id', $userId)
            ->with('items')
            ->first();
    }
 
    public function findWithItems(string $orderId): ?Order
    {
        return Order::query()
            ->where('id', $orderId)
            ->with(['items', 'user'])
            ->first();
    }

}

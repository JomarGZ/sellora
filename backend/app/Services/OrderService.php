<?php

namespace App\Services;

use App\Exceptions\InvalidOrderTransitionException;
use App\Exceptions\OrderNotFoundException;
use App\Models\Order;
use App\Repositories\Contracts\IOrderRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class OrderService
{
    public function __construct(
        private readonly IOrderRepository $orderRepository,
    ) {}

    public function listForUser(int $userId, array $filters = []): LengthAwarePaginator
    {
        $perPage = min((int) ($filters['per_page'] ?? 15), 50);
 
        return $this->orderRepository->paginateForUser(
            userId:  $userId,
            perPage: $perPage,
            filters: $filters,
        );
    }

    public function getForUser(int $orderId, int $userId): Order
    {
        $order = $this->orderRepository->findForUserWithItems($orderId, $userId);
 
        if (!$order) {
            throw new OrderNotFoundException($orderId);
        }
 
        return $order;
    }

    public function updateStatus(int $orderId, string $newStatus): Order
    {
        // Load without user scoping — status updates are admin operations.
        $order = $this->orderRepository->findWithItems($orderId);
 
        if (!$order) {
            throw new OrderNotFoundException($orderId);
        }
 
        if (!$order->canTransitionTo($newStatus)) {
            throw new InvalidOrderTransitionException(
                fromStatus:         $order->status,
                toStatus:           $newStatus,
                allowedTransitions: $order->allowedTransitions(),
            );
        }
 
        $previousStatus = $order->status;
        if ($newStatus === Order::STATUS_DELIVERED) {
            $order->delivered_at = now();
        }
        $this->orderRepository->updateStatus($order, $newStatus, [
            'delivered_at' => $order->delivered_at
        ]);
 
        Log::info('Order status updated', [
            'order_id'        => $order->id,
            'from_status'     => $previousStatus,
            'to_status'       => $newStatus,
        ]);
 
        // Reload to return the fresh model.
        return $order->fresh('items');
    }
}

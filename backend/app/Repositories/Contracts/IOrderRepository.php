<?php

namespace App\Repositories\Contracts;

use App\DTOs\CartSnapshotDTO;
use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface IOrderRepository
{
    public function createFromSnapshot(
        string          $checkoutId,
        string          $userId,
        string          $paymentIntentId,
        CartSnapshotDTO $snapshot,
    ): Order;

    public function updateStatus(Order $order, string $newStatus, array $extra = []): void;

    public function paginateForUser(
        string $userId,
        int    $perPage = 15,
        array  $filters = [],
    ): LengthAwarePaginator;

    public function findForUserWithItems(string $orderId, string $userId): ?Order;

    public function findWithItems(string $orderId): ?Order;
}

<?php

namespace App\Repositories\Contracts;

use App\DTOs\CartSnapshotDTO;
use App\Models\Order;

interface IOrderRepository
{
    public function createFromSnapshot(
        string          $checkoutId,
        string          $userId,
        string          $paymentIntentId,
        CartSnapshotDTO $snapshot,
    ): Order;
}

<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\DTOs\V1\CheckoutDTO;
use App\Models\Order;
use Illuminate\Support\Collection;

interface IOrderRepository
{
    public function createOrder(
        CheckoutDTO $dto,
        Collection $productItems,
        float $subtotal,
        float $shippingFee,
        int $pendingStatusId,
    ): Order;
}

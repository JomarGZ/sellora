<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\ProductItem;

interface IProductItemRepository
{
    public function findActiveById(int $productItemId): ?ProductItem;

    public function findAndLockById(int $productItemId): ?ProductItem;
 
    public function incrementReservedQty(int $productItemId, int $quantity): void;
  
    public function decrementReservedQty(int $productItemId, int $quantity): void;
 
    public function deductStockAndClearReservation(int $productItemId, int $quantity): void;
}

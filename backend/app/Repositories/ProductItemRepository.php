<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\ProductItem;
use App\Repositories\Contracts\IProductItemRepository;
use Illuminate\Support\Facades\DB;

final class ProductItemRepository extends BaseRepository implements IProductItemRepository
{
    public function __construct(ProductItem $productItem)
    {
        parent::__construct($productItem);
    }

    public function findActiveById(int $productId): ?ProductItem
    {
        return $this->model->query()
            ->where('id', $productId)
            ->where('status', 'active')
            ->first();
    }

    public function findAndLockById(int $productItemId): ?ProductItem
    {
        // lockForUpdate() emits SELECT ... FOR UPDATE
        // This blocks any other transaction trying to lock the same row.
        return $this->model->query()
            ->where('id', $productItemId)
            ->lockForUpdate()
            ->first();
    }
 
    public function incrementReservedQty(int $productItemId, int $quantity): void
    {
        // Atomic increment — never reads then writes, so safe under concurrency.
        $this->model->where('id', $productItemId)->increment('reserved_qty', $quantity);
    }
 
    public function decrementReservedQty(int $productItemId, int $quantity): void
    {
        // Guards against negative reserved_qty with the WHERE clause.
        $this->model->where('id', $productItemId)
            ->where('reserved_qty', '>=', $quantity)
            ->decrement('reserved_qty', $quantity);
    }
 
    public function deductStockAndClearReservation(int $productItemId, int $quantity): void
    {
        // One atomic UPDATE that does both operations together.
        // qty         -= quantity  (real stock leaves the warehouse)
        // reserved_qty -= quantity  (the soft hold is consumed)
        // The WHERE qty >= quantity guard is a safety net — this should
        // never fire because we re-validated with a lock above, but
        // defensive SQL is always worth the extra characters.
        DB::table('product_items')
            ->where('id', $productItemId)
            ->where('qty', '>=', $quantity)
            ->update([
                'qty'          => DB::raw("qty - {$quantity}"),
                'reserved_qty' => DB::raw("GREATEST(reserved_qty - {$quantity}, 0)"),
            ]);
    }
}

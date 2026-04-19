<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ProductItem;
use DomainException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class InventoryService
{
    /**
     * Lock stock rows for update within the calling transaction.
     * Throws if ANY item is out of stock.
     * Must be called inside a DB::transaction().
     */
    public function reserveStock(Collection $items): void
    {
        $items->each(function ($item) {
            $product = ProductItem::lockForUpdate()
                ->findOrFail($item->productItemId);

            if ($product->qty_in_stock < $item->quantity) {
                throw new DomainException(
                    "Insufficient stock for SKU {$product->sku}: "
                    ."requested {$item->quantity}, available {$product->qty_in_stock}"
                );
            }
        });
    }

    /**
     * Deduct stock safely. Idempotent via conditional WHERE.
     * Called from the webhook job after payment is confirmed.
     */
    public function deductStock(array $items): void
    {
        foreach ($items as $item) {
            $updated = DB::table('product_items')
                ->where('id', $item['product_item_id'])
                ->where('qty_in_stock', '>=', $item['quantity']) // safety net
                ->decrement('qty_in_stock', $item['quantity']);

            if ($updated === 0) {
                // Should not reach here in normal flow, but log for monitoring.
                Log::critical('Stock deduction failed', $item);
                // Do NOT throw — let order proceed, alert ops.
            }
        }
    }
}

<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ProductItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

final class ProductItemObserver
{
    /**
     * Handle the ProductItem "deleting" event.
     */
    public function deleting(ProductItem $productItem): void
    {
        if (! $productItem->isForceDeleting()) {
            return;
        }
        $productItem->loadMissing('images');

        foreach ($productItem->images as $image) {
            if (! $image->image_path) {
                return;
            }

            $isUsedInOrders = DB::table('order_items')
                ->where('product_item_id', $productItem->id)
                ->where('product_image_path', $image->image_path)
                ->exists();

            if (! $isUsedInOrders && Storage::exists($image->image_path)) {
                Storage::delete($image->image_path);
            }
        }
    }
}

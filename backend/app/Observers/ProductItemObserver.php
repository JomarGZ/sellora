<?php

namespace App\Observers;

use App\Models\ProductItem;
use Illuminate\Support\Facades\Storage;

class ProductItemObserver
{
    

    /**
     * Handle the ProductItem "deleting" event.
     */
    public function deleting(ProductItem $productItem): void
    {
        if ($productItem->isForceDeleting()) {
            $productItem->loadMissing('itemImages');
            foreach ($productItem->itemImages as $image) {
                if ($image->image_path && Storage::exists($image->image_path)) {
                    Storage::delete($image->image_path);
                }
            }
        }
    }
}

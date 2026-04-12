<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\ProductItem;
use Illuminate\Support\Facades\Storage;

final class ProductItemObserver
{
    /**
     * Handle the ProductItem "deleting" event.
     */
    public function deleting(ProductItem $productItem): void
    {
        if ($productItem->isForceDeleting()) {
            $productItem->loadMissing('images');
            foreach ($productItem->images as $image) {
                if ($image->image_path && Storage::exists($image->image_path)) {
                    Storage::delete($image->image_path);
                }
            }
        }
    }
}

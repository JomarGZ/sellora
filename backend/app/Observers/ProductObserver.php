<?php

namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductObserver
{

    public function deleting(Product $product): void
    {
        if ($product->isForceDeleting()) {
            $product->loadMissing('images');
            foreach ($product->images as $image) {
                if ($image->image_path && Storage::exists($image->image_path)) {
                    Storage::delete($image->image_path);
                }
            }
        }
    }
}

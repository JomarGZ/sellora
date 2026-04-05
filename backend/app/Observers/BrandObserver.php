<?php

namespace App\Observers;

use App\Models\Brand;
use Illuminate\Support\Facades\Storage;

class BrandObserver
{
    /**
     * Handle the Brand "force deleted" event.
     */
    public function forceDeleted(Brand $brand): void
    {
        logger('brand', [$brand]);
        if ($brand->logo && Storage::exists($brand->logo)) {
            Storage::delete($brand->logo);
        }
    }
}

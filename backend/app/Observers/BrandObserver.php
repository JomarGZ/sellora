<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Brand;
use Illuminate\Support\Facades\Storage;

final class BrandObserver
{
    /**
     * Handle the Brand "force deleted" event.
     */
    public function forceDeleted(Brand $brand): void
    {
        if ($brand->logo && Storage::exists($brand->logo)) {
            Storage::delete($brand->logo);
        }
    }
}

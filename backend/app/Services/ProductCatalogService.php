<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ProductItem;

final class ProductCatalogService
{
    public function getNewArrivals(int $limit = 10)
    {
        return ProductItem::query()->with(['product', 'images'])
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getBestSellers(int $limit = 10)
    {
        return ProductItem::query()->with(['product', 'images'])
            ->limit($limit)
            ->get();
    }
}

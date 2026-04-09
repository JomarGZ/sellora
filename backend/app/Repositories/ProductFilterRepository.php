<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Brand;
use App\Models\ProductCategory;
use App\Repositories\Contracts\IProductFilterRepository;
use Illuminate\Database\Eloquent\Collection;

final class ProductFilterRepository implements IProductFilterRepository
{
    public function getCategories(): Collection
    {
        return ProductCategory::query()
            ->select(['id', 'parent_id', 'name', 'slug'])
            ->whereNull('parent_id')
            ->with(['children:id,parent_id,name,slug'])
            ->orderBy('name')
            ->get();
    }

    public function getBrands(): Collection
    {
        return Brand::query()
            ->select(['id', 'name', 'slug', 'logo'])
            ->orderBy('name')
            ->get();
    }
}

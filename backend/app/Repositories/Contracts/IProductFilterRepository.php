<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Brand;
use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Collection;

interface IProductFilterRepository
{
    /**
     * @return Collection<int, ProductCategory>
     */
    public function getCategories(): Collection;

    /**
     * @return Collection<int, Brand>
     */
    public function getBrands(): Collection;
}

<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Brand;
use App\Models\ProductCategory;
use App\Repositories\Contracts\IProductFilterRepository;
use Illuminate\Database\Eloquent\Collection;

final readonly class ProductFilterService
{
    public function __construct(
        private IProductFilterRepository $repository
    ) {}

    /**
     * @return Collection<int, ProductCategory>
     */
    public function getCategories(): Collection
    {
        return $this->repository->getCategories();
    }

    /**
     * @return Collection<int, Brand>
     */
    public function getBrands(): Collection
    {
        return $this->repository->getBrands();
    }
}

<?php

namespace App\Repositories\Contracts;

use App\DTOs\V1\ProductFilterDTO;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface IProductRepository extends IRepository
{
    public function getNewArrivals(int $limit = 10): Collection;

    public function getBestSellers(int $limit = 10): Collection;

    public function catalog(ProductFilterDTO $filters): LengthAwarePaginator;
}

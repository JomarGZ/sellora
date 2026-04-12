<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface IProductItemRepository
{
    public function findByIds(array $ids): Collection;
}

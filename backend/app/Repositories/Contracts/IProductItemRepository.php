<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface IProductItemRepository
{
    public function findByIds(array $ids): Collection;

    public function decrementStock(int $productItemId, int $qty): void;
}

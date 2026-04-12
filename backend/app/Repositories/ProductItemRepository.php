<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\ProductItem;
use Illuminate\Database\Eloquent\Builder;
use App\Repositories\Contracts\IProductItemRepository;
use Illuminate\Support\Collection;

final class ProductItemRepository extends BaseRepository implements IProductItemRepository
{
     public function __construct(ProductItem $product)
    {
        parent::__construct($product);
    }

    /**
     * @return Builder<Product>
     */
    private function query(): Builder
    {
        return $this->model->newQuery();
    }

    public function findByIds(array $ids): Collection
    {
        return $this->query()
            ->select([
                'id',
                'product_id',
                'sku',
                'price',
                'qty_in_stock',
            ])
            ->with(['product:id,name'])
            ->whereIn('id', $ids)
            ->get()
            ->keyBy('id');
    }
}

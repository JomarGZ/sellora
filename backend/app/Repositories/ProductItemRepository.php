<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\ProductItem;
use App\Repositories\Contracts\IProductItemRepository;
use Illuminate\Support\Collection;

final class ProductItemRepository extends BaseRepository implements IProductItemRepository
{
    public function __construct(ProductItem $productItem)
    {
        parent::__construct($productItem);
    }

    public function findByIds(array $ids): Collection
    {
        return $this->model->query()
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

    public function decrementStock(int $productItemId, int $qty): void
    {
        ProductItem::where('id', $productItemId)
                ->decrement('qty_in_stock', $qty);
    }
}

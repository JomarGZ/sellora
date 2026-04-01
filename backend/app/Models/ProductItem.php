<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ProductItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProductItem extends Model
{
    /** @use HasFactory<ProductItemFactory> */
    use HasFactory;

    protected $fillable = [
        'product_id',
        'sku',
        'price',
        'qty_in_stock',
    ];

    /**
     * Get the product that owns the item.
     *
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}

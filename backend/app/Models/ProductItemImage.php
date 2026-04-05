<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ProductItemImageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ProductItemImage extends Model
{
    /** @use HasFactory<ProductItemImageFactory> */
    use HasFactory;

    protected $fillable = [
        'product_item_id',
        'image_path',
    ];

    /**
     * Get the product item that owns the image.
     *
     * @return BelongsTo<ProductItem, $this>
     */
    public function productItem(): BelongsTo
    {
        return $this->belongsTo(ProductItem::class);
    }
}

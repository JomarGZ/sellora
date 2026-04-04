<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ProductItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

final class ProductItem extends Model
{
    /** @use HasFactory<ProductItemFactory> */
    use HasFactory;

    use SoftDeletes;

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

    /**
     * The attribute values that belong to the item.
     *
     * @return BelongsToMany<AttributeValue, $this>
     */
    public function attributeValues(): BelongsToMany
    {
        return $this->belongsToMany(AttributeValue::class, 'product_item_attribute_values');
    }

    public function productItemAttributeValues(): HasMany
    {
        return $this->hasMany(ProductItemAttributeValue::class);
    }

    /**
     * The images that belong to the item.
     *
     * @return HasMany<ProductItemImage, $this>
     */
    public function itemImages(): HasMany
    {
        return $this->hasMany(ProductItemImage::class);
    }
}

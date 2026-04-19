<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ProductItemObserver;
use Database\Factories\ProductItemFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy([ProductItemObserver::class])]
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

    protected $casts = [
        'price' => 'decimal:2',
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

    /**
     * Get the attribute values for the item.
     *
     * @return HasMany<ProductItemAttributeValue, $this>
     */
    public function productItemAttributeValues(): HasMany
    {
        return $this->hasMany(ProductItemAttributeValue::class);
    }

    /**
     * The images that belong to the item.
     *
     * @return HasMany<ProductItemImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductItemImage::class);
    }

    /** @return HasMany<OrderItem, $this> */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function productItemReviews()
    {
        return $this->hasMany(ProductItemReview::class);
    }
}

<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ProductItemAttributeValueFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class ProductItemAttributeValue extends Model
{
    /** @use HasFactory<ProductItemAttributeValueFactory> */
    use HasFactory;

    protected $fillable = [
        'product_item_id',
        'attribute_value_id',
    ];

    /**
     * Get the product items that have this attribute value.
     *
     * @return BelongsToMany<ProductItem, $this>
     */
    public function productItems(): BelongsToMany
    {
        return $this->belongsToMany(ProductItem::class, 'product_item_attribute_values');
    }

    /**
     * Get the attribute values that belong to this product item.
     *
     * @return BelongsToMany<AttributeValue, $this>
     */
    public function attributeValues(): BelongsToMany
    {
        return $this->belongsToMany(AttributeValue::class, 'product_item_attribute_values');
    }
}

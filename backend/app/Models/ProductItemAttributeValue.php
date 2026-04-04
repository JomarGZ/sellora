<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ProductItemAttributeValueFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
     * @return BelongsTo<ProductItem, $this>
     */
    public function productItems(): BelongsTo
    {
        return $this->belongsTo(ProductItem::class);
    }

    /**
     * Get the attribute values that belong to this product item.
     *
     * @return BelongsTo<AttributeValue, $this>
     */
    public function attributeValues(): BelongsTo
    {
        return $this->belongsTo(AttributeValue::class);
    }
}

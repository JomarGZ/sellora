<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\AttributeValueFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

final class AttributeValue extends Model
{
    /** @use HasFactory<AttributeValueFactory> */
    use HasFactory;

    use SoftDeletes;

    protected $fillable = [
        'attribute_id',
        'value',
        'hex_color',
        'image',
    ];

    /**
     * Get the attribute that owns the value.
     *
     * @return BelongsTo<Attribute, $this>
     */
    public function attribute(): BelongsTo
    {
        return $this->belongsTo(Attribute::class);
    }

    /**
     * The items that belong to the attribute value.
     *
     * @return BelongsToMany<ProductItem, $this>
     */
    public function productItems(): BelongsToMany
    {
        return $this->belongsToMany(ProductItem::class, 'product_item_attribute_values');
    }

    public function swatch(): ?array
    {
        if ($this->hex_color) {
            return ['type' => 'color', 'value' => $this->hex_color];
        }

        if ($this->image) {
            return ['type' => 'image', 'value' => url(Storage::url($this->image))];
        }

        return null;
    }
}

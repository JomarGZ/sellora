<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\AttributeValueFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class AttributeValue extends Model
{
    /** @use HasFactory<AttributeValueFactory> */
    use HasFactory;

    protected $fillable = [
        'attribute_id',
        'value',
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
}

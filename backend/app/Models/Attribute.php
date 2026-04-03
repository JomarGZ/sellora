<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\AttributeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Attribute extends Model
{
    /** @use HasFactory<AttributeFactory> */
    use HasFactory;

    use SoftDeletes;

    protected $fillable = [
        'name',
    ];

    /**
     * This attribute has many values
     *
     * @return HasMany<AttributeValue, $this>
     */
    public function values(): HasMany
    {
        return $this->hasMany(AttributeValue::class);
    }
}

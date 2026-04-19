<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class ShoppingCart extends Model
{
    /** @use HasFactory<\Database\Factories\ShoppingCartFactory> */
    use HasFactory;

    protected $fillable = ['user_id'];

    /** @return HasMany<ShoppingCartItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(ShoppingCartItem::class, 'shopping_cart_id');
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

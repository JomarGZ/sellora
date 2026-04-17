<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShoppingCartItem extends Model
{
    /** @use HasFactory<\Database\Factories\ShoppingCartItemFactory> */
    use HasFactory;

    protected $fillable = [
        'shopping_cart_id',
        'shopping_cart_item_id',
        'quantity'
    ];

    public function cart(): BelongsTo
    {
        return $this->belongsTo(ShoppingCart::class, 'shopping_cart_item_id');
    }

    public function productItem(): BelongsTo
    {
        return $this->belongsTo(ProductItem::class);
    }
}

<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\OrderItemFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

final class OrderItem extends Model
{
    /** @use HasFactory<OrderItemFactory> */
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_item_id',
        'price',
        'quantity',
        'product_name',
        'sku',
        'product_id',
        'product_sku',
        'unit_price',
        'line_total',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity'   => 'integer',
        'unit_price' => 'decimal:2',
        'line_total' => 'decimal:2',
    ];

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return BelongsTo<ProductItem, $this>
     */
    public function productItem(): BelongsTo
    {
        return $this->belongsTo(ProductItem::class);
    }

    public function review()
    {
        return $this->hasOne(ProductItemReview::class);
    }
}

<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'checkout_id',
        'stripe_payment_intent_id',
        'items_snapshot',
        'total',
        'status',
        'subtotal',
        'shipping_fee',
        'shopping_cart_id',
        'currency',
        'idempotency_key',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'items_snapshot' => 'array',
        'total'          => 'decimal:2',
    ];

    const STATUS_CONFIRMED  = 'confirmed';
    const STATUS_PROCESSING = 'processing';
    const STATUS_SHIPPED    = 'shipped';
    const STATUS_DELIVERED  = 'delivered';
    const STATUS_REFUNDED   = 'refunded';
    const STATUS_CANCELLED  = 'cancelled';

    const STATUS_OPTIONS = [
        self::STATUS_CONFIRMED  => 'Confirmed',
        self::STATUS_PROCESSING => 'Processing',
        self::STATUS_SHIPPED    => 'Shipped',
        self::STATUS_DELIVERED  => 'Delivered',
        self::STATUS_REFUNDED   => 'Refunded',
        self::STATUS_CANCELLED  => 'Cancelled',
    ];
    
    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function checkout()
    {
        return $this->belongsTo(Checkout::class, 'checkout_id');
    }

    /**
     * @return BelongsTo<ShippingMethod, $this>
     */
    public function shippingMethod(): BelongsTo
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

  

    public function address()
    {
        return $this->hasOne(OrderAddress::class);
    }
}

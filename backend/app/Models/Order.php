<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
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
        'delivered_at',
        'received_at',
        'refunded_at',
        'total',
        'status',
        'subtotal',
        'shipping_fee',
        'cart_id',
        'currency',
        'idempotency_key',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'delivered_at' => 'datetime',
        'refunded_at' => 'datetime',
        'received_at' => 'datetime',
        'items_snapshot' => 'array',
        'total'          => 'decimal:2',
    ];

    const STATUS_PROCESSING = 'processing';
    const STATUS_SHIPPED    = 'shipped';
    const STATUS_DELIVERED  = 'delivered';
    const STATUS_REFUNDED   = 'refunded';
    const STATUS_CANCEL_REQUESTED = 'cancel_requested';
    const STATUS_CANCELLED  = 'cancelled';
    const STATUS_CANCEL_REJECTED = 'cancel_rejected';
    const STATUS_COMPLETED  = 'completed';

    public const SALE_STATUSES = [
        self::STATUS_PROCESSING,
        self::STATUS_SHIPPED,
        self::STATUS_DELIVERED,
    ];

    const STATUS_OPTIONS = [
        self::STATUS_PROCESSING => 'Processing',
        self::STATUS_SHIPPED    => 'Shipped',
        self::STATUS_DELIVERED  => 'Delivered',
        self::STATUS_REFUNDED   => 'Refunded',
        self::STATUS_CANCELLED  => 'Cancelled',
    ];

    const TRANSITIONS = [
        self::STATUS_PROCESSING => [self::STATUS_SHIPPED],
        self::STATUS_SHIPPED    => [self::STATUS_DELIVERED],
        self::STATUS_CANCEL_REQUESTED => [self::STATUS_CANCELLED, self::STATUS_CANCEL_REJECTED],
        self::STATUS_DELIVERED  => [],
        self::STATUS_REFUNDED   => [],
        self::STATUS_CANCELLED  => [],
    ];

    const ALL_STATUSES = [
        self::STATUS_PROCESSING,
        self::STATUS_SHIPPED,
        self::STATUS_DELIVERED,
        self::STATUS_REFUNDED,
        self::STATUS_CANCELLED,
        self::STATUS_COMPLETED
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

    public static function saleStatus(): array
    {
        return self::SALE_STATUSES;
    }

    public function allowedTransitions(): array
    {
        return self::TRANSITIONS[$this->status] ?? [];
    }


    public function canTransitionTo(string $newStatus): bool
    {
        return in_array($newStatus, $this->allowedTransitions(), true);
    }

    public function isTerminal(): bool
    {
        return empty($this->allowedTransitions());
    }

    public function isProcessing(): bool { return $this->status === self::STATUS_PROCESSING; }
    public function isCancelRequested(): bool { return $this->status === self::STATUS_CANCEL_REQUESTED; }
    public function isShipped(): bool    { return $this->status === self::STATUS_SHIPPED; }
    public function isDelivered(): bool  { return $this->status === self::STATUS_DELIVERED; }
    public function isRefunded(): bool   { return $this->status === self::STATUS_REFUNDED; }
    public function isCancelled(): bool  { return $this->status === self::STATUS_CANCELLED; }

    public function canRequestCancel(): bool
    {
        return $this->isProcessing();
    }

    public function canApproveCancel(): bool
    {
        return $this->isCancelRequested();
    }

    public function canMarkAsReceived(): bool
    {
        return $this->isDelivered() && $this->received_at === null;
    }
 
    #[Scope]
    public function forUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    #[Scope]
    public function withStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }
}

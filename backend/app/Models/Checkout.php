<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Checkout extends Model
{
    protected $fillable = [
        'cart_id',
        'user_id',
        'idempotency_key',
        'stripe_session_id',
        'stripe_payment_intent_id',
        'cart_snapshot',
        'status',
        'failure_reason',
        'expires_at',
    ];

    protected $casts = [
        'cart_snapshot' => 'array',
        'expires_at'    => 'datetime',
    ];

    const STATUS_PENDING   = 'pending';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED    = 'failed';
    const STATUS_EXPIRED   = 'expired';
    const STATUS_REFUNDED  = 'refunded';

    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cart_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->hasOne(Order::class);
    }

    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isCompleted()
    {
        return $this->status === self::STATUS_COMPLETED;
    }


}

<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\PaymentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Payment extends Model
{
    /** @use HasFactory<PaymentFactory> */
    use HasFactory;

    protected $fillable = [
        'order_id',
        'payment_method',
        'amount',
        'transaction_id',
        'status',
        'payment_provider',
    ];

    protected $casts = ['amount' => 'decimal:2']; 

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        Country
        return $this->belongsTo(Order::class);
    }
}

<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use InvalidArgumentException;

final class ProductItemReview extends Model
{
    /** @use HasFactory<\Database\Factories\ProductItemReviewFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_item_id',
        'product_item_id',
        'rating',
        'comment',
    ];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<OrderItem, $this> */
    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    /** @return BelongsTo<ProductItem, $this> */
    public function productItem(): BelongsTo
    {
        return $this->belongsTo(ProductItem::class);
    }

    protected static function booted()
    {
        self::saving(function ($model) {
            if ($model->rating < 1 || $model->rating > 5) {
                throw new InvalidArgumentException('Rating must be between 1 and 5.');
            }
        });
    }
}

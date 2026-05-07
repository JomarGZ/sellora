<?php

declare(strict_types=1);

namespace App\Models;

use App\Observers\ProductObserver;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property float|null $product_items_min_price
 * @property float|null $product_items_max_price
 * @property int|null $product_items_sum_qty_in_stock
 */
#[ObservedBy([ProductObserver::class])]
final class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    use HasSlug;
    use SoftDeletes;

    protected $fillable = [
        'brand_id',
        'product_category_id',
        'name',
        'description',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function productItemReviews()
    {
        return $this->hasManyThrough(
            ProductItemReview::class,
            ProductItem::class,
            'product_id',        // FK on product_items
            'product_item_id',   // FK on reviews
            'id',                // products.id
            'id'                 // product_items.id
        );
    }

    public function isNew(): bool
    {
        return $this->created_at
            ? $this->created_at->gt(now()->subDays(config('shop.new_product_days')))
            : false;
    }

    public function orderItems()
    {
        return $this->hasManyThrough(
            OrderItem::class,
            ProductItem::class,
            'product_id',      // FK on product_items
            'product_item_id', // FK on order_items
            'id',              // products.id
            'id'               // product_items.id
        );
    }

    /**
     * This product belongs to a brand
     *
     * @return BelongsTo<Brand, $this>
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * This product belongs to a category
     *
     * @return BelongsTo<ProductCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    /**
     * This product has many images
     *
     * @return HasMany<ProductImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * This product has many items
     *
     * @return HasMany<ProductItem, $this>
     */
    public function productItems(): HasMany
    {
        return $this->hasMany(ProductItem::class);
    }

    /**
     * This product has one primary image.
     *
     * @return HasOne<ProductImage, $this>
     */
    public function primaryImage(): HasOne
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    #[Scope]
    protected function search(Builder $query, ?string $search): Builder
    {
        return $query->when(
            $search,
            fn (Builder $q) => $q->where('name', 'like', "%{$search}%")
        );
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    #[Scope]
    protected function filterByCategory(Builder $query, ?array $categorySlugs): Builder
    {
        return $query->when(
            $categorySlugs,
            fn (Builder $q) => $q->whereHas(
                'category',
                fn (Builder $q) => $q->whereIn('slug', $categorySlugs)
                    ->orWhereHas('parent', fn (Builder $q) => $q->whereIn('slug', $categorySlugs))
            )
        );
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    #[Scope]
    protected function filterByBrand(Builder $query, ?array $brandSlugs): Builder
    {
        return $query->when(
            $brandSlugs,
            fn (Builder $q) => $q->whereHas(
                'brand',
                fn (Builder $q) => $q->whereIn('slug', $brandSlugs)
            )
        );
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    #[Scope]
    protected function filterByPriceRange(Builder $query, ?float $min, ?float $max): Builder
    {
        return $query->when(
            $min || $max,
            fn (Builder $q) => $q->whereHas(
                'productItems',
                function (Builder $q) use ($min, $max): void {
                    $q->when($min, fn (Builder $q) => $q->where('price', '>=', $min))
                        ->when($max, fn (Builder $q) => $q->where('price', '<=', $max));
                }
            )
        );
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    #[Scope]
    protected function sortBy(Builder $query, ?string $sort): Builder
    {
        $query->select('products.*');

        return match ($sort) {

            'default' => $query
                ->OrderBy('products.id'),
            'price_asc' => $query
                ->leftJoin('product_items', 'products.id', '=', 'product_items.product_id')
                ->groupBy('products.id')
                ->orderByRaw('MIN(product_items.price) ASC')
                ->orderBy('products.id'),

            'price_desc' => $query
                ->leftJoin('product_items', 'products.id', '=', 'product_items.product_id')
                ->groupBy('products.id')
                ->orderByRaw('MIN(product_items.price) DESC')
                ->orderBy('products.id'),

            'newest' => $query
                ->orderByDesc('products.created_at')
                ->orderBy('products.id'),

            default => $query
                ->orderBy('products.id'),
        };
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Product $product */
        $product = $this->resource;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'rating' => [
                'average' => round((float) ($this->avg_rating ?? 0), 1),
                'count' => $this->reviews_count ?? 0,
            ],
            'is_bestseller' => ($this->sold_count ?? 0) >= 50,
            'is_new' => $product->isNew(),
            'min_price' => $product->product_items_min_price,
            'description' => $product->description,
            'created_at' => $product->created_at?->toIso8601String(),
            'updated_at' => $product->updated_at?->toIso8601String(),
            'brand' => BrandResource::make($this->whenLoaded('brand')),
            'category' => CategoryResource::make($this->whenLoaded('category')),
            'primary_image' => ProductImageResource::make($this->whenLoaded('primaryImage')),
        ];
    }
}

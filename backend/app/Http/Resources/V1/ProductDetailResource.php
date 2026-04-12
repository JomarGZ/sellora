<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Product
 */
final class ProductDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price_range' => [
                'min' => $this->product_items_min_price,
                'max' => $this->product_items_max_price,
            ],
            'total_stock' => (int) $this->product_items_sum_qty_in_stock,
            'brand' => BrandResource::make($this->whenLoaded('brand')),
            'category' => CategoryResource::make($this->whenLoaded('category')),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'attributes' => AttributeResource::collection($this->additional['attributes'] ?? []),
            'variants' => ProductItemResource::collection($this->whenLoaded('productItems')),
        ];
    }
}

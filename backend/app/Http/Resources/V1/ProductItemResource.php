<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use App\Models\ProductItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin ProductItem
 */
final class ProductItemResource extends JsonResource
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
            'sku' => $this->sku,
            'price' => $this->price,
            'qty' => $this->qty,
            'in_stock' => $this->qty > 0,
            'product' => ProductResource::make($this->whenLoaded('product')),
            'attribute_values' => $this->whenLoaded(
                'attributeValues',
                fn () => $this->attributeValues->map(function ($value) {
                    return [
                        'attribute_id' => $value->attribute_id,
                        'attribute_name' => $value->attribute->name ?? null,
                        'value_id' => $value->id,
                        'value' => $value->value,
                    ];
                })
            ),
            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(fn ($image): array => [
                    'id' => $image->id,
                    'url' => url(Storage::url($image->image_path)),
                ]);
            }),
        ];
    }
}

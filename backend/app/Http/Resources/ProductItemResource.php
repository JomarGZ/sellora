<?php

declare(strict_types=1);

namespace App\Http\Resources;

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
            'qty_in_stock' => $this->qty_in_stock,
            'in_stock' => $this->qty_in_stock > 0,
            'attribute_value_ids' => $this->attributeValues->pluck('id'),
            'images' => $this->images->map(fn ($image): array => [
                'id' => $image->id,
                'url' => url(Storage::url($image->image_path)),
            ]),
        ];
    }
}

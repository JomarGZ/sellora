<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

final class ProductItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var ProductItem $this */
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'price' => $this->price,
            'qty_in_stock' => $this->qty_in_stock,
            'in_stock' => $this->qty_in_stock > 0,
            'attribute_value_ids' => $this->attributeValues->pluck('id'),
            'images' => $this->images->map(fn ($image) => [
                'id' => $image->id,
                'url' => url(Storage::url($image->image_path)),
            ]),
        ];
    }
}

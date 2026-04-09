<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

final class ProductImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var ProductImage $productImage */
        $productImage = $this->resource;

        return [
            'id' => $productImage->id,
            'image_url' => $this->resolveImageUrl($productImage),
            'is_primary' => $productImage->is_primary,
        ];
    }

    private function resolveImageUrl(ProductImage $productImage): string
    {
        $fallback = config('app.fallback_image');

        assert(is_string($fallback));

        if ($productImage->image_path) {
            return Storage::url($productImage->image_path);
        }

        return $fallback;
    }
}

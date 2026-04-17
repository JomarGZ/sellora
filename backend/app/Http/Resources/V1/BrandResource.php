<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

final class BrandResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Brand $brand */
        $brand = $this->resource;

        return [
            'id' => $brand->id,
            'name' => $brand->name,
            'slug' => $brand->slug,
            'logo' => $this->resolveImageUrl($brand),
        ];
    }

    private function resolveImageUrl(Brand $brand): string
    {
        $fallback = config('app.fallback_image');
        assert(is_string($fallback));

        if ($brand->logo) {
            return url(Storage::url($brand->logo));
        }

        return $fallback;
    }
}

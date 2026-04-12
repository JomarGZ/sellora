<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\AttributeValue;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin AttributeValue
 */
final class AttributeValueResource extends JsonResource
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
            'label' => ucfirst($this->value),
            'value' => $this->value,
            'hex_color' => $this->hex_color,
            'swatch' => $this->swatch(),
        ];
    }
}

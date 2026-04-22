<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class CountryResource extends JsonResource
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
            'iso2' => $this->iso2,
            'name' => $this->name,
            'phone_code' => $this->phone_code,
            'iso3' => $this->iso3,
            'region' => $this->region,
            'sub_region' => $this->subregion,
        ];
    }
}

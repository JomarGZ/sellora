<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class UserAddressResource extends JsonResource
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
            'user' => UserResource::make($this->whenLoaded('user')),
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'phone' => $this->phone,
            'country_id' => $this->country_id,
            'city_id' => $this->city_id,
            'country' => CountryResource::make($this->whenLoaded('country')),
            'city' => CityResource::make($this->whenLoaded('city')),
            'street_address' => $this->street_address,
            'is_default' => (bool) $this->is_default,
        ];
    }
}

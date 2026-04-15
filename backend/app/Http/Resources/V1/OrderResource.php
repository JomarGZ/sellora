<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class OrderResource extends JsonResource
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
            'status' => OrderStatusResource::make($this->whenLoaded('status')),
            'currency' => $this->currency,
            'subtotal' => number_format((float) $this->subtotal, 2),
            'shipping_fee' => number_format((float) $this->shipping_fee, 2),
            'order_total' => number_format((float) $this->order_total, 2),
            'shipping_method' => ShippingMethodResource::make($this->whenLoaded('shippingMethod')),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'address' => OrderAddressResource::make($this->whenLoaded('address')),
        ];
    }
}

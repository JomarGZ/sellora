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
            'status' => $this->status->status,
            'currency' => $this->currency,
            'subtotal' => number_format((float) $this->subtotal, 2),
            'shipping_fee' => number_format((float) $this->shipping_fee, 2),
            'order_total' => number_format((float) $this->order_total, 2),
            'shipping_method' => [
                'name' => $this->shippingMethod->name,
                'estimated_days' => $this->shippingMethod->estimated_days,
            ],
            'items' => $this->items->map(fn ($item) => [
                'product_item_id' => $item->product_item_id,
                'product_name' => $item->product_name,
                'sku' => $item->sku,
                'qty' => $item->quantity,
                'price' => number_format((float) $item->price, 2),
            ]),
            'address' => [
                'first_name' => $this->address->first_name,
                'last_name' => $this->address->last_name,
                'phone' => $this->address->phone,
                'street_address' => $this->address->street_address,
                'city' => $this->address->city,
                'country' => $this->address->country,
            ],
        ];
    }
}

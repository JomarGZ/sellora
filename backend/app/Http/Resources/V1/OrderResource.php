<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use Illuminate\Http\Resources\Json\JsonResource;

final class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'         => $this->resource->id,
            'status'     => $this->resource->status,
            'currency'   => $this->resource->currency,
            'subtotal'   => $this->resource->subtotal,
            'shipping'   => $this->resource->shipping_fee,
            'total'      => $this->resource->total,
            'placed_at'  => $this->resource->created_at->toIso8601String(),
            'items'      => $this->resource->items->map(fn ($item) => [
                'product_name' => $item->product_name,
                'product_sku'  => $item->product_sku,
                'quantity'     => $item->quantity,
                'unit_price'   => $item->unit_price,
                'line_total'   => $item->line_total,
            ]),
        ];
    }
}

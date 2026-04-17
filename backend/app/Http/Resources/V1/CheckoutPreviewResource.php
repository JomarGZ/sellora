<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class CheckoutPreviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'items' => collect($this->resource['items'])->map(fn ($item) => [
                'product_item_id' => $item['product_item']->id,
                'sku' => $item['product_item']->sku,
                'product_name' => $item['product_item']->product->name,
                'price' => number_format((float) $item['product_item']->price, 2),
                'qty' => $item['qty'],
                'subtotal' => number_format($item['subtotal'], 2),
            ]),
            'subtotal' => number_format($this->resource['subtotal'], 2),
            'shipping_fee' => number_format($this->resource['shipping_fee'], 2),
            'total' => number_format($this->resource['total'], 2),
            'shipping_method' => $this->resource['shipping_method'] ? [
                'id' => $this->resource['shipping_method']->id,
                'name' => $this->resource['shipping_method']->name,
                'estimated_days' => $this->resource['shipping_method']->estimated_days,
            ] : null,
        ];
    }
}

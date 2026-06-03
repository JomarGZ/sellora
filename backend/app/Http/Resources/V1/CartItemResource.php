<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         return [
            'id'       => $this->resource->id,
 
            // Product is conditionally loaded. If the product was
            // deactivated after being added to the cart, product will
            // be null. The frontend should render a "no longer available"
            // indicator for these items.
            'product'  => $this->when(
                $this->resource->relationLoaded('productItem'),
                fn () => $this->resource->productItem
                    ? [
                        'id'            => $this->resource->productItem->id,
                        'name'          => $this->resource->productItem->name,
                        'sku'           => $this->resource->productItem->sku,
                        // Live available quantity — the frontend can use this
                        // to warn the user if stock has dropped since they
                        // added the item (e.g. "Only 2 left!").
                        'available_qty' => $this->resource->productItem->availableQty(),
                        'is_available'  => true,
                    ]
                    : [
                        'is_available' => false, // Product deactivated
                    ]
            ),
 
            'quantity'   => $this->resource->quantity,
 
            // unit_price is the price at the time the item was added,
            // not the live product price. These may differ.
            'unit_price' => $this->resource->unit_price,
            'line_total' => $this->resource->lineTotal(),
            'added_at'   => $this->resource->created_at->toIso8601String(),
        ];

    }
}

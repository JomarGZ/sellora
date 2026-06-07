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
            'id' => $this->id,
            // Product is conditionally loaded. If the product was
            // deactivated after being added to the cart, product will
            // be null. The frontend should render a "no longer available"
            // indicator for these items.
            'product_item' => ProductItemResource::make($this->whenLoaded('productItem')), 
            'quantity'   => $this->quantity,
            // unit_price is the price at the time the item was added,
            // not the live product price. These may differ.
            'unit_price' => $this->unit_price,
            'line_total' => $this->lineTotal(),
            'added_at'   => $this->created_at->toIso8601String(),
        ];

    }
}

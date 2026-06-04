<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
 
        // Compute subtotal from loaded items using bcmath to avoid
        // floating-point precision errors. Never store derived totals
        // in the DB — they would drift from the actual line items.
        // $subtotal = $itemsCollection->reduce(
        //     fn (string $carry, $item) => bcadd($carry, $item->lineTotal(), 2),
        //     '0.00'
        // );
 
        return [
            'id'     => $this->id,
            'status' => $this->status,
 
            // A boolean the frontend can use to render the cart as
            // read-only without needing to know the internal status
            // strings. True only when status=active AND not expired.
            'is_modifiable' => $this->isActive() && !$this->isExpired(),
            // Expose whether the cart has passed its TTL so the frontend
            // can display an "your cart has expired" banner even before
            // the user tries to mutate it.
            'is_expired'    => $this->isExpired(),
            'expires_at'    => $this->expires_at?->toIso8601String(),
            'items'       => CartItemResource::collection($this->relationLoaded('items') ? $this->items : []),
            'items_count' => $this->items?->count() ?? 0,
            'subtotal'    => $this->subTotal(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin OrderItem
 */
final class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'product_item_id'   => $this->product_item_id, 
            'product_name' => $this->product_name,
            'product_sku'  => $this->product_sku,
            'quantity'     => $this->quantity,
            'unit_price'   => $this->unit_price,
            'line_total'   => $this->line_total,
        ];
    }
}

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
            'product_item_id' => $this->product_item_id,
            'product_name' => $this->product_name,
            'sku' => $this->sku,
            'qty' => $this->quantity,
            'price' => number_format((float) $this->price, 2),
        ];
    }
}

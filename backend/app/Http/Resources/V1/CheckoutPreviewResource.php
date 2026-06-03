<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use App\DTOs\CheckoutPreviewDTO;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class CheckoutPreviewResource extends JsonResource
{

    public function __construct(public readonly CheckoutPreviewDTO $dto) {}
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'cart_id'           => $this->dto->cartId,
            'currency'          => $this->dto->currency,
            'subtotal'          => $this->dto->subtotal,
            'shipping_fee'      => $this->dto->shippingFee,
            'total'             => $this->dto->total,
            'all_items_in_stock' => $this->dto->allItemsInStock,
            'items'             => array_map(
                fn ($item) => [
                    'product_id'   => $item->productId,
                    'product_name' => $item->productName,
                    'product_sku'  => $item->productSku,
                    'quantity'     => $item->quantity,
                    'unit_price'   => $item->unitPrice,
                    'line_total'   => $item->lineTotal,
                ],
                $this->dto->items
            ),
        ];
    }
}

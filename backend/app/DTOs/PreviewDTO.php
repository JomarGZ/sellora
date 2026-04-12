<?php

namespace App\DTOs;

use App\Http\Requests\Api\V1\CheckoutPreviewRequest;
use Illuminate\Support\Collection;

class PreviewDTO
{
    /**
     * @param Collection<int, CheckoutItemDTO> $items
     */
    public function __construct(
        public Collection $items,
        public ?int       $shippingMethodId,
    ) {}

    public static function fromRequest(CheckoutPreviewRequest $request): self
    {
        return new self(
            items: collect($request->validated('items'))
                ->map(fn (array $item) => new CheckoutItemDTO(
                    productItemId: $item['product_item_id'],
                    qty:           $item['qty'],
                )),
            shippingMethodId: $request->integer('shipping_method_id') ?: null,
        );
    }
}

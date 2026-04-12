<?php

namespace App\DTOs\V1;

use App\Http\Requests\Api\V1\CheckoutRequest;
use Illuminate\Support\Collection;

class CheckoutDTO
{
    /**
     * @param Collection<int, CheckoutItemDTO> $items
     */
    public function __construct(
        public Collection        $items,
        public CheckoutAddressDTO $address,
        public int               $shippingMethodId,
    ) {}

    public static function fromRequest(CheckoutRequest $request): self
    {
        return new self(
            items: collect($request->validated('items'))
                ->map(fn (array $item) => new CheckoutItemDTO(
                    productItemId: $item['product_item_id'],
                    qty:           $item['qty'],
                )),
            address: new CheckoutAddressDTO(
                addressId: $request->integer('address_id'),
            ),
            shippingMethodId: $request->integer('shipping_method_id'),
        );
    }
}

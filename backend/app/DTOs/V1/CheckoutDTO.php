<?php

declare(strict_types=1);

namespace App\DTOs\V1;

use App\Http\Requests\Api\V1\CheckoutRequest;
use Illuminate\Support\Collection;

final class CheckoutDTO
{
    /**
     * @param  Collection<int, CheckoutItemDTO>  $items
     */
    public function __construct(
        public readonly Collection $items,
        public readonly CheckoutAddressDTO $address,
        public readonly int $shippingMethodId,
        public readonly string $idempotencyKey
    ) {}

    public static function fromRequest(CheckoutRequest $request): self
    {
        return new self(
            items: collect($request->validated('items'))
                ->map(fn (array $item) => new CheckoutItemDTO(
                    productItemId: $item['product_item_id'],
                    qty: $item['qty'],
                )),
            address: new CheckoutAddressDTO(
                addressId: $request->validated('address_id'),
            ),
            shippingMethodId: $request->validated('shipping_method_id'),
            idempotencyKey: $request->validated('idempotency_key'),
        );
    }
}

<?php

declare(strict_types=1);

namespace App\DTOs\V1;

use Illuminate\Http\Request;

final class CheckoutDTO
{
    public function __construct(
        public int $userId,
        public string $idempotencyKey,
        public int $shippingMethodId,
        /** @var CheckoutItemDTO[] */
        public array $items,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            userId: auth()->id(),
            idempotencyKey: $request->input('idempotency_key'),
            shippingMethodId: (int) $request->input('shipping_method_id'),

            items: collect($request->input('items'))
                ->map(fn ($item) => new CheckoutItemDTO(
                    productItemId: (int) $item['product_item_id'],
                    quantity: (int) $item['qty'],
                ))
                ->toArray(),
        );
    }
}

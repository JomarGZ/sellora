<?php

namespace App\DTOs;

use App\Models\Cart;

class CartSnapshotDTO
{
    public function __construct(
        public int $cartId,
        public int $userId,
        public array  $items,
        public string $subtotal,
        public string $shippingFee,
        public string $total,
        public string $currency,
        public string $snapshotAt,  // ISO 8601 timestamp
    ) {}

    public static function fromCart(Cart $cart, string $shippingFee): self
    {
        $items = $cart->items->map(
            fn ($item) => CartSnapshotItemDTO::fromCartItem($item)
        )->all();
 
        $subtotal = array_reduce(
            $items,
            fn (string $carry, CartSnapshotItemDTO $item) => bcadd($carry, $item->lineTotal, 2),
            '0.00'
        );
 
        $total = bcadd($subtotal, $shippingFee, 2);
 
        return new self(
            cartId:      $cart->id,
            userId:      $cart->user_id,
            items:       $items,
            subtotal:    $subtotal,
            shippingFee: $shippingFee,
            total:       $total,
            currency:    'usd',
            snapshotAt:  now()->toIso8601String(),
        );
    }

    public function toArray(): array
    {
        return [
            'cart_id'      => $this->cartId,
            'user_id'      => $this->userId,
            'items'        => array_map(fn ($i) => $i->toArray(), $this->items),
            'subtotal'     => $this->subtotal,
            'shipping_fee' => $this->shippingFee,
            'total'        => $this->total,
            'currency'     => $this->currency,
            'snapshot_at'  => $this->snapshotAt,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self(
            cartId:      $data['cart_id'],
            userId:      $data['user_id'],
            items:       array_map(
                fn ($i) => CartSnapshotItemDTO::fromArray($i),
                $data['items']
            ),
            subtotal:    $data['subtotal'],
            shippingFee: $data['shipping_fee'],
            total:       $data['total'],
            currency:    $data['currency'],
            snapshotAt:  $data['snapshot_at'],
        );
    }

    public function totalInCents(): int
    {
        return (int) bcmul($this->total, '100', 0);
    }
}



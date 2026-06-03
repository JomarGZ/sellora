<?php

namespace App\DTOs;

use App\Models\CartItem;

class CartSnapshotItemDTO
{
    public function __construct(
        public int $productItemId,
        public string $productName,
        public string $productSku,
        public int $quantity,
        public string $unitPrice,
        public string $lineTotal,
    ) {}

    public static function fromCartItem(CartItem $item): self
    {
        return new self(
            productItemId: $item->product_item_id,
            productName: $item->productItem->product->name,
            productSku: $item->productItem->sku,
            quantity: $item->quantity,
            unitPrice: number_format((float) $item->unit_price, 2, '.', ''),
            lineTotal: bcmul((string) $item->unit_price, (string) $item->quantity, 2),
        );
    }

    public function toArray(): array
    {
        return [
            'product_item_id' => $this->productItemId,
            'product_name' => $this->productName,
            'product_sku' => $this->productSku,
            'quantity' => $this->quantity,
            'unit_price' => $this->unitPrice,
            'line_total' => $this->lineTotal,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self(
            productItemId: $data['product_item_id'],
            productName: $data['product_name'],
            productSku: $data['product_sku'],
            quantity: (int) $data['quantity'],
            unitPrice: $data['unit_price'],
            lineTotal: $data['line_total'],
        );
    }
}
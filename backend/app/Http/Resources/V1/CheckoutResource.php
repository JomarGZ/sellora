<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CheckoutResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->resource->id,
            'status'          => $this->resource->status,
            'expires_at'      => $this->resource->expires_at?->toIso8601String(),
            // The Stripe session URL is what the frontend redirects to.
            // We don't expose the raw session ID — only the URL.
            'stripe_checkout_url' => $this->when(
                isset($this->resource->stripe_session_url),
                $this->resource->stripe_session_url ?? null
            ),
            // Surface totals from the snapshot so the frontend can
            // display a confirmation before redirecting to Stripe.
            'summary'         => [
                'subtotal'     => $this->resource->cart_snapshot['subtotal'] ?? null,
                'shipping_fee' => $this->resource->cart_snapshot['shipping_fee'] ?? null,
                'total'        => $this->resource->cart_snapshot['total'] ?? null,
                'currency'     => $this->resource->cart_snapshot['currency'] ?? null,
                'items_count'  => count($this->resource->cart_snapshot['items'] ?? []),
            ],
        ];
    }
}

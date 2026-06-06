<?php

declare(strict_types=1);

namespace App\Http\Resources\V1;

use Illuminate\Http\Resources\Json\JsonResource;

final class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'       => $this->id,
            'status'   => $this->status,
            'currency' => $this->currency,
 
            // ── Financial summary ──────────────────────────────
            'subtotal'     => $this->subtotal,
            'shipping_fee' => $this->shipping_fee,
            'total'        => $this->total,
            'can_mark_as_received' => $this->canMarkAsReceived(),
            'can_cancel' => $this->canCancel(),
            // ── State machine hints for the frontend ───────────
            // The frontend renders action buttons based on this list.
            // An empty array means the order is in a terminal state.
            'allowed_transitions' => $this->allowedTransitions(),
            'is_terminal'         => $this->isTerminal(),
 
            // ── Line items ─────────────────────────────────────
            'items'       => OrderItemResource::collection($this->relationLoaded('items') ? $this->items : []),
            'items_count' => $this->items?->count() ?? 0,
 
            // ── Timestamps ─────────────────────────────────────
            'placed_at'  => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            $this->mergeWhen(
                $request->user()?->is_admin,
                [
                    'stripe_payment_intent_id' => $this->stripe_payment_intent_id,
                    'checkout_id'              => $this->checkout_id,
                    'user'                     => [
                        'id'    => $this->user?->id,
                        'email' => $this->user?->email,
                    ],
                ]
            ),
        ];
    }
}

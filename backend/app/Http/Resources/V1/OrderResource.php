<?php
// app/Http/Resources/OrderResource.php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'             => $this->id,
            'status'         => $this->status->value,        // ✅ "paid" not the enum object
            'status_label'   => $this->status->label(),      // ✅ "Payment confirmed"
            'is_paid'        => $this->status->isPaid(),     // ✅ boolean for frontend
            'order_total'    => $this->order_total,
            'currency'       => $this->currency,
            'idempotency_key' => $this->idempotency_key,
            'created_at'     => $this->created_at->toISOString(),
            'payment'        => new PaymentResource($this->whenLoaded('payment')),
        ];
    }
}
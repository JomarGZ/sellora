<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class OrderCollection extends ResourceCollection
{
    public $collects = OrderResource::class;


    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
 
            // Standard Laravel pagination meta is merged automatically.
            // Additional meta we add on top:
            'meta' => [
                'status_counts' => $this->statusCounts(),
            ],
        ];
    }

    private function statusCounts(): array
    {
        return $this->collection
            ->groupBy(fn ($resource) => $resource->resource->status)
            ->map(fn ($group) => $group->count())
            ->toArray();
    }
}

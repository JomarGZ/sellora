<?php

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\OrderNotFoundException;
use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\V1\OrderCollection;
use App\Http\Resources\V1\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class OrderController extends ApiController
{
    public function __construct(protected OrderService $orderService){}
    
   public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Order::class);
 
        $filters = $request->only(['status', 'per_page']);
 
        // Validate the optional status filter at the controller level.
        // This is lightweight input sanitisation, not business logic.
        if (isset($filters['status']) && !in_array($filters['status'], Order::ALL_STATUSES, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid status filter.',
                'valid'   => Order::ALL_STATUSES,
            ], 422);
        }
 
        $paginator = $this->orderService->listForUser(
            userId:  $request->user()->id,
            filters: $filters,
        );
 
        $collection = new OrderCollection($paginator);
 
        // withResponse() lets us add top-level pagination metadata
        // in a consistent envelope format across all list endpoints.
        return response()->json(
            array_merge(
                ['success' => true],
                $collection->toArray($request),
                [
                    'pagination' => [
                        'current_page' => $paginator->currentPage(),
                        'last_page'    => $paginator->lastPage(),
                        'per_page'     => $paginator->perPage(),
                        'total'        => $paginator->total(),
                        'from'         => $paginator->firstItem(),
                        'to'           => $paginator->lastItem(),
                    ],
                    'links' => [
                        'first' => $paginator->url(1),
                        'last'  => $paginator->url($paginator->lastPage()),
                        'prev'  => $paginator->previousPageUrl(),
                        'next'  => $paginator->nextPageUrl(),
                    ],
                ]
            )
        );
    }

    public function show(Request $request, string $orderId): JsonResponse
    {
        try {
            $order = $this->orderService->getForUser(
                orderId: $orderId,
                userId:  $request->user()->id,
            );
 
            // Explicit policy check — belt-and-suspenders alongside
            // the repository's user_id scoping.
            Gate::authorize('view', $order);
 
            return response()->json([
                'success' => true,
                'data'    => new OrderResource($order),
            ]);
 
        } catch (OrderNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }
 
}

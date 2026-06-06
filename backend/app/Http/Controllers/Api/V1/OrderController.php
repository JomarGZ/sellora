<?php

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\InvalidOrderTransitionException;
use App\Exceptions\OrderCannotRequestCancellationException;
use App\Exceptions\OrderNotFoundException;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Api\V1\UpdateOrderStatusRequest;
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
            return $this->error(
                message: 'Invalid status filter.',
                code: 422,
                errors: [
                    'valid_status' => Order::ALL_STATUSES
                ]
                );
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

    public function show(Request $request, int $orderId): JsonResponse
    {
        try {
            $order = $this->orderService->getForUser(
                orderId: $orderId,
                userId:  $request->user()->id,
            );
 
            // Explicit policy check — belt-and-suspenders alongside
            // the repository's user_id scoping.
            Gate::authorize('view', $order);
 
            return $this->success(
                data: new OrderResource($order),
                message: 'Retrieve order successfully.'
            );
 
        } catch (OrderNotFoundException $e) {
            return $this->error(
                message: $e->getMessage(),
                code: 404
            );
        }
    }

    public function updateStatus(
        UpdateOrderStatusRequest $request,
        int                   $orderId
    ): JsonResponse {

        try {
            $order = $this->orderService->updateStatus(
                orderId:   $orderId,
                newStatus: $request->validated('status'),
            );
 
            return $this->success(
                message: "Order status updated to '{$order->status}'.",
                data: new OrderResource($order),
            );
 
        } catch (OrderNotFoundException $e) {
            return $this->error(
                message: $e->getMessage(),
                code: 404
            );
 
        } catch (InvalidOrderTransitionException $e) {
            return $this->error(
                message:  $e->getMessage(),
                code: 409,
                errors: [
                    'details' => [
                        'from_status'         => $e->fromStatus,
                        'to_status'           => $e->toStatus,
                        'allowed_transitions' => $e->allowedTransitions,
                    ]
                ]
            ); 
        }
    }

    public function markAsReceived(Order $order)
    {
            return '';
    }

    public function cancel(Order $order)
    {
        try {
            $order = $this->orderService->requestCancellation($order);

            return $this->success(
                data: new OrderResource($order),
                message: 'Cancel request submitted successfully.'
            );
        } catch (OrderCannotRequestCancellationException $e) {
           return $this->error(
                message: $e->getMessage() ?: 'You cannot request cancellation for this order.',
                code: 422,
            );
        }
    }

 
}

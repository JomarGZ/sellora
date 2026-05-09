<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\OrderStatus;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Api\V1\CheckoutPreviewRequest;
use App\Http\Requests\Api\V1\CheckoutRequest;
use App\Http\Resources\V1\OrderResource;
use App\Models\Order;
use App\Repositories\OrderRepository;
use App\Services\CheckoutService;
use App\Services\OrderPreviewService;
use App\Services\StripeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class CheckoutController extends ApiController
{
    public function __construct(
        private readonly CheckoutService $checkoutService,
        private readonly OrderPreviewService $orderPreview,
        private readonly StripeService $stripeService,
        private readonly OrderRepository $orderRepository
    ) {}

   public function snapshot(CheckoutPreviewRequest $request): JsonResponse {

        $order = $this->orderPreview
            ->preview(
                auth()->user(),
                $request->array('ids')
            );

        return $this->created(
            data: new OrderResource($order),
            message: 'Order Preview successfully',
        );
    }

    public function current(): JsonResponse
    {
        $order = Order::query()
            ->where('user_id', auth()->id())
            ->where('status', OrderStatus::Pending)
            ->with('items')
            ->latest()
            ->first();

        if (!$order) {
            return $this->notFound(message: 'No active checkout found');
        }

        return $this->success(
            data: OrderResource::make($order),
            message: 'Retrieved pending order successfully.'
        );
    }

    public function checkout(CheckoutRequest $request): JsonResponse
    {

        $order = Order::query()
            ->where('status', OrderStatus::Pending)
            ->where('id', $request->order_id)
            ->where('user_id', auth()->id())->firstOrFail();

        $result = $this->checkoutService->checkout(auth()->user(), $order);

        return $this->success(
            data: [
                'order' => $result['order'],
                'checkout_url' => $result['checkout_url'],
            ],
            message: $result['message'] ?? 'Checkout processed successfully.'
        );

    }

    public function verifySession(Request $request)
    {
        $sessionId = $request->query('session_id');

        $session = $this->stripeService->retrieveSession($sessionId);
        $order = $this->orderRepository->find((int) $session->metadata->order_id);

        return $this->success(data: [
            'order' => new OrderResource($order),
            'payment_status' => $session->payment_status,
        ], message: 'Verifying Checkout process');
    }

    public function cancel(Order $order): JsonResponse
    {
        if ($order->status->isTerminal()) {
            return response()->json(['error' => 'Order cannot be cancelled'], 422);
        }

        $order->transitionTo(OrderStatus::Cancelled);

        return response()->json(['status' => $order->status->value]);
    }
}

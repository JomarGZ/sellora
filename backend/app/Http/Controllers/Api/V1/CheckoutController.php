<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\V1\CheckoutDTO;
use App\Enums\OrderStatus;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Api\V1\CheckoutPreviewRequest;
use App\Http\Requests\Api\V1\CheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Http\Resources\V1\CheckoutPreviewResource;
use App\Models\Order;
use App\Repositories\OrderRepository;
use App\Services\CheckoutService;
use App\Services\StripeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class CheckoutController extends ApiController
{
    public function __construct(
        private readonly CheckoutService $checkoutService,
        private readonly StripeService $stripeService,
        private readonly OrderRepository $orderRepository
    ) {}

    public function preview(CheckoutPreviewRequest $request): JsonResponse
    {
        // $result = $this->checkoutService->preview(
        //     PreviewDTO::fromRequest($request)
        // );

        // return $this->success(
        //     data: new CheckoutPreviewResource($result),
        //     message: 'Checkout preview retrieved successfully.'
        // );

        return response()->json(['sds' => 'asdsad']);
    }

    public function checkout(CheckoutRequest $request): JsonResponse
    {
        $result = $this->checkoutService->checkout(
            CheckoutDTO::fromRequest($request)
        );

        return response()->json([
            'success' => true,
            'message' => $result['message'] ?? 'Checkout processed successfully.',
            'data' => [
                'order' => $result['order'],
                'checkout_url' => $result['checkout_url'],
            ],
        ]);
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

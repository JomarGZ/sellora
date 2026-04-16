<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\V1\CheckoutDTO;
use App\DTOs\V1\PreviewDTO;
use App\Exceptions\OutOfStockException;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Api\V1\CheckoutPreviewRequest;
use App\Http\Requests\Api\V1\CheckoutRequest;
use App\Http\Resources\V1\CheckoutPreviewResource;
use App\Http\Resources\V1\OrderResource;
use App\Repositories\Contracts\IOrderRepository;
use App\Services\CheckoutService;
use App\Services\StripeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

final class CheckoutController extends ApiController
{
    public function __construct(
        private readonly CheckoutService $checkoutService,
        private readonly StripeService $stripeService,
        private readonly IOrderRepository $orderRepository
    ) {}

    public function preview(CheckoutPreviewRequest $request): JsonResponse
    {
        $result = $this->checkoutService->preview(
            PreviewDTO::fromRequest($request)
        );

        return $this->success(
            data: new CheckoutPreviewResource($result),
            message: 'Checkout preview retrieved successfully.'
        );
    }

    public function checkout(CheckoutRequest $request): JsonResponse
    {
        try {
            $result = $this->checkoutService->checkout(
                CheckoutDTO::fromRequest($request)
            );

            return $this->success(
                data: [
                    'order' => new OrderResource($result['order']),
                    'checkout_url' => $result['checkout_url'],
                    'status' => $result['status'] ?? null,
                ],
                message: $result['message'] ?? 'Checkout processed successfully.'
            );

        } catch (OutOfStockException $e) {
            return $this->error(
                message: $e->getMessage(),
                code: 422
            );
        } catch (Throwable $e) {
            return $this->error(
                message: 'Something went wrong during checkout.',
                code: 500
            );
        }
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

    public function cancel()
    {
        return $this->success(message: 'Checkout cancelled.');
    }
}

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
use App\Services\CheckoutService;
use Illuminate\Http\JsonResponse;

final class CheckoutController extends ApiController
{
    public function __construct(
        private readonly CheckoutService $service
    ) {}

    public function preview(CheckoutPreviewRequest $request): JsonResponse
    {
        $result = $this->service->preview(
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
            $result = $this->service->checkout(
                CheckoutDTO::fromRequest($request)
            );

            return $this->success(
                data: [
                    'order' => new OrderResource($result['order']),
                    'checkout_url' => $result['checkout_url'],
                ],
                message: 'Order created successfully.'
            );
        } catch (OutOfStockException $e) {
            return $this->error(message: $e->getMessage(), code: 422);
        }
    }
}

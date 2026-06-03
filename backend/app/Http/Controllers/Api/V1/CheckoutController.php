<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\CartEmptyException;
use App\Exceptions\CartOwnershipException;
use App\Exceptions\InsufficientStockException;
use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Api\V1\CheckoutInitiateRequest;
use App\Http\Requests\Api\V1\CheckoutPreviewRequest;
use App\Http\Resources\V1\CheckoutPreviewResource;
use App\Http\Resources\V1\CheckoutResource;
use App\Services\CheckoutPreviewService;
use App\Services\CheckoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\ApiErrorException;

final class CheckoutController extends ApiController
{
    public function __construct(
        private readonly CheckoutPreviewService $previewService,
        private readonly CheckoutService        $checkoutService,
    ) {}

    public function preview(CheckoutPreviewRequest $request): JsonResponse
    {
        try {
            $preview = $this->previewService->preview($request->user()->id);

            return $this->success(
                data: new CheckoutPreviewResource($preview),
                message: 'Checkout preview generated successfully.'
            );
        } catch (CartOwnershipException | CartEmptyException $e) {
            return $this->error(
                message: $e->getMessage(),
                code: 422
            );
        }
    }

     public function initiate(CheckoutInitiateRequest $request): JsonResponse
    {
        try {
            $checkout = $this->checkoutService->initiate(
                userId:         $request->user()->id,
                idempotencyKey: $request->validated('idempotency_key'),
            );
 
            $stripeSession = app(\Stripe\StripeClient::class)
                ->checkout->sessions->retrieve($checkout->stripe_session_id);
 
         
            $checkout->stripe_session_url = $stripeSession->url;
 
            return $this->success(
                data: new CheckoutResource($checkout),
                message: 'Checkout initiated successfully.'
            );
        } catch (CartOwnershipException | CartEmptyException $e) {
            return $this->error(
                message: $e->getMessage(),
                code: 422
            );
        } catch (InsufficientStockException $e) {
            return $this->error(
                message: 'One or more items are out of stock.',
                code: 409,
                errors: [
                    'product_id'   => $e->productItemId,
                    'product_name' => $e->productName,
                    'requested'    => $e->requested,
                    'available'    => $e->available,
                ]
            );
        } catch (ApiErrorException $e) {
            Log::error('Stripe API error during checkout initiation', [
                'user_id' => $request->user()->id,
                'error'   => $e->getMessage(),
            ]);
 
            return $this->error(
                message: 'Payment provider error. Please try again.',
                code: 502
            );
        }
    }

}

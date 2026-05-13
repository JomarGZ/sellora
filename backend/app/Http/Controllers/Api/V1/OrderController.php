<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\OrderStatus;
use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\V1\OrderResource;
use App\Repositories\OrderRepository;
use Illuminate\Http\Request;

class OrderController extends ApiController
{
    public function __construct(protected OrderRepository $orderRepository){}
    
    public function index(Request $request)
    {
        $status = $request->filled('status') ? OrderStatus::from($request->string('status')) : null;

        $orders = $this->orderRepository->getPaginatedUserOrders(auth()->id(), $status);

        return OrderResource::collection($orders);
    }
}

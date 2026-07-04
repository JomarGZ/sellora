<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Support\Facades\Storage;

class InvoiceController extends ApiController
{
    public function __construct(private readonly OrderService $orderService){}
    
    public function download(Order $order)
    {
        $invoice = $this->orderService->getInvoice($order);
        return Storage::disk('public')->download($invoice->file_path);
    }
}

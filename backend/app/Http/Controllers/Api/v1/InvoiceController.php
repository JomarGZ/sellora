<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function download(Order $order)
    {
        $order->load(['user', 'items']);
        $pdf = Pdf::loadView('invoices.order', [
            'order' => $order,
            'user' => $order->user,
            'items' => $order->items,
        ]);

        return $pdf->download("{$order->user->first_name}-{$order->id}-invoice.pdf");
    }
}

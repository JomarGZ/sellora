<?php

namespace App\Services;

use App\Enums\RefundReasonType;
use App\Exceptions\InvalidOrderTransitionException;
use App\Exceptions\OrderCannotRequestCancellationException;
use App\Exceptions\OrderCannotBeMarkAsReceivedException;
use App\Exceptions\OrderNotFoundException;
use App\Models\Checkout;
use App\Models\Order;
use App\Repositories\Contracts\IOrderRepository;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class OrderService
{
    public function __construct(
        private readonly IOrderRepository $orderRepository,
    ) {}

    public function listForUser(int $userId, array $filters = []): LengthAwarePaginator
    {
        $perPage = min((int) ($filters['per_page'] ?? 10), 50);
 
        return $this->orderRepository->paginateForUser(
            userId:  $userId,
            perPage: $perPage,
            filters: $filters,
        );
    }

    public function getForUser(int $orderId, int $userId): Order
    {
        $order = $this->orderRepository->findForUserWithItems($orderId, $userId);
 
        if (!$order) {
            throw new OrderNotFoundException($orderId);
        }
 
        return $order;
    }

    public function updateStatus(int $orderId, string $newStatus): Order
    {
        // Load without user scoping — status updates are admin operations.
        $order = $this->orderRepository->findWithItems($orderId);
 
        if (!$order) {
            throw new OrderNotFoundException($orderId);
        }
 
        if (!$order->canTransitionTo($newStatus)) {
            throw new InvalidOrderTransitionException(
                fromStatus:         $order->status,
                toStatus:           $newStatus,
                allowedTransitions: $order->allowedTransitions(),
            );
        }
 
        $previousStatus = $order->status;
        if ($newStatus === Order::STATUS_DELIVERED) {
            $order->delivered_at = now();
        }
        $this->orderRepository->updateStatus($order, $newStatus, [
            'delivered_at' => $order->delivered_at
        ]);
 
        Log::info('Order status updated', [
            'order_id'        => $order->id,
            'from_status'     => $previousStatus,
            'to_status'       => $newStatus,
        ]);
 
        // Reload to return the fresh model.
        return $order->fresh('items');
    }

    public function requestCancellation(Order $order)
    {
        if (!$order->canRequestCancel()) {
            throw new OrderCannotRequestCancellationException($order->id);
        }

        return DB::transaction(function () use ($order) {
            $order->update([
                'status' => Order::STATUS_CANCEL_REQUESTED
            ]);

            return $order->fresh();
        });
    }

    public function markAsReceived(Order $order)
    {
        if (! $order->canMarkAsReceived()) {
            throw new OrderCannotBeMarkAsReceivedException($order->id);
        }

        return DB::transaction(function () use ($order) {
            $order->update([
                'status' => Order::STATUS_COMPLETED,
                'received_at' => now()
            ]);

            return $order->fresh();
        });
    }
    
    public function approveCancellation(Order $order)
    {
        if (! $order->canApproveCancel()) {
            throw new \DomainException('Cannot approve cancellation.');
        }

        return DB::transaction(function () use ($order) {
            $checkout = $order->checkout;
            if (! $checkout) {
                throw new \RuntimeException('Checkout not found for order.');
            }
            app(RefundService::class)->refundPayment(
                checkout: $order->checkout,
                paymentIntentId: $order->stripe_payment_intent_id,
                reasonType: RefundReasonType::CUSTOMER_REQUEST,
            );

            $checkout->update([
                'status' => Checkout::STATUS_REFUNDED
            ]);
            
            $order->update([
                'status' => Order::STATUS_CANCELLED,
                'refunded_at' => now()
            ]);

            return $order->fresh();
        });
    }

    public function rejectCancellation(Order $order) 
    {
        if (! $order->canRejectCancellation()) {
            throw new \DomainException('Cannot approve cancellation.');
        }
        return DB::transaction(function () use ($order) {

            $order->update([
                'status' => Order::STATUS_PROCESSING, // or previous status
            ]);

            return $order->fresh();
        });
    }

    public function generateInvoice(Order $order): string
    {
        $order->loadMissing(['user', 'items']);

        $filename = "invoices/{$order->id}/invoice.pdf";
        
        return DB::transaction(function () use ($order, $filename) {
            $invoice = $order->invoice()->create([
                'file_path' => $filename
            ]);

            $invoice->update([
                'invoice_number' => sprintf(
                    'INV-%s-%06d',
                    now()->year,
                    $invoice->id
                )
            ]);

            if (!Storage::disk('public')->exists($filename)) {
                $pdf = Pdf::loadView('invoices.order', [
                    'order' => $order,
                    'user' => $order->user,
                    'items' => $order->items,
                    'invoice_number' => $invoice->invoice_number
                ]);

                Storage::disk('public')->put($filename,$pdf->output());
            }
            return $filename;
        });
    }

    public function getInvoice(Order $order)
    {
        $order->loadMissing('invoice');

        if (!$order->invoice || !Storage::disk('public')->exists($order->invoice->file_path)) {
            return $this->generateInvoice($order);
        }
        return $order->invoice;
    }
}

@component('mail::message')

# Order Confirmation

Hi {{ $order->user->first_name }},

Thank you for your order! We’ve successfully received your purchase.

---

## Order Details

- **Order ID:** #{{ $order->id }}
- **Total:** ${{ number_format($order->total, 2) }}

### Items:
@foreach ($order->items as $item)
- {{ $item->product_name }} (x{{ $item->quantity }})
@endforeach

---

We are now processing your order. We’ll notify you once it has been shipped.

Thanks,  
**{{ config('app.name') }}**

@endcomponent
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sellora Invoice</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 13px;
            color: #333;
        }

        .container {
            padding: 30px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
        }

        .brand {
            font-size: 22px;
            font-weight: bold;
            color: #111;
        }

        .tagline {
            font-size: 11px;
            color: #777;
        }

        .company {
            text-align: right;
            font-size: 12px;
        }

        .title {
            font-size: 26px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-top: 10px;
        }

        .section {
            margin-bottom: 18px;
        }

        .label {
            font-weight: bold;
            color: #555;
            margin-bottom: 3px;
        }

        .badge {
            padding: 4px 8px;
            background: #e8f5e9;
            color: #1b5e20;
            font-size: 11px;
            border-radius: 4px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th {
            background: #f5f5f5;
            padding: 10px;
            text-align: left;
            font-size: 12px;
        }

        td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }

        .right {
            text-align: right;
        }

        .summary {
            margin-top: 20px;
            width: 100%;
        }

        .summary td {
            padding: 5px 0;
        }

        .total {
            font-size: 16px;
            font-weight: bold;
            border-top: 2px solid #000;
            padding-top: 10px;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            color: #777;
        }

        .product {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .product img {
            width: 35px;
            height: 35px;
            object-fit: cover;
            border-radius: 4px;
        }
    </style>
</head>

<body>
<div class="container">

    {{-- HEADER --}}
    <div class="header">
        <div>
            <div class="brand">SELLORA</div>
            <div class="tagline">Style. Quality. Confidence.</div>

            <div class="title">INVOICE</div>
            <p>{{$invoice_number}}</p>
        </div>

        <div class="company">
            <strong>Sellora Online Store</strong><br>
            support@sellora.com<br>
            +63 900 000 0000<br>
            Philippines
        </div>
    </div>

    {{-- CUSTOMER INFO --}}
    <div class="section">
        <div class="label">Billed To</div>
        <div>
            {{ $user->first_name }} {{ $user->last_name }}<br>
            {{ $user->email }}
        </div>
    </div>

    {{-- ORDER INFO --}}
    <div class="section">
        <div class="label">Order Details</div>
        Date: {{ $order->created_at->format('Y-m-d') }} <br>
        Status: <span class="badge">{{ ucfirst($order->status ?? 'paid') }}</span>
    </div>

    {{-- ITEMS --}}
    <table>
        <thead>
        <tr>
            <th>Product</th>
            <th>Variant</th>
            <th>Qty</th>
            <th class="right">Price</th>
            <th class="right">Total</th>
        </tr>
        </thead>

        <tbody>
        @foreach ($items as $item)
            <tr>
                <td>
                    <div class="product">
                        <span>{{ $item->product_name }}</span>
                    </div>
                </td>

                <td>{{ $item->attributes }}</td>
                <td>{{ $item->quantity }}</td>

                <td class="right">${{ number_format($item->unit_price, 2) }}</td>

                <td class="right">
                    ${{ number_format($item->line_total, 2) }}
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>

    {{-- SUMMARY --}}
    <table class="summary">
        <tr>
            <td></td>
            <td class="right">Subtotal:</td>
            <td class="right">${{ number_format($order->subtotal ?? 0, 2) }}</td>
        </tr>

        <tr>
            <td></td>
            <td class="right">Shipping:</td>
            <td class="right">${{ number_format($order->shipping_fee ?? 0, 2) }}</td>
        </tr>

        <tr>
            <td></td>
            <td class="right total">Total:</td>
            <td class="right total">${{ number_format($order->total ?? 0, 2) }}</td>
        </tr>
    </table>

    {{-- FOOTER --}}
    <div class="footer">
        Thank you for shopping at Sellora<br>
        This invoice is system-generated and valid without signature.
    </div>

</div>
</body>
</html>
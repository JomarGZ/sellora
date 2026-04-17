<?php

namespace App\Enums;

enum CheckoutType: string
{
    case Cart = 'cart';
    case BuyNow = 'buy_now';
}

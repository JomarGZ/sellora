<?php

namespace App\Enums;

enum RefundReasonType: string
{
    case DUPLICATE = 'duplicate';
    case FRAUD = 'fraudulent';
    case CUSTOMER_REQUEST = 'requested_by_customer';
}

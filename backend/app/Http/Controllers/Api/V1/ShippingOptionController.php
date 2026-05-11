<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Models\ShippingMethod;

class ShippingOptionController extends ApiController
{
    public function default()
    {
        return $this->success(
            data: ShippingMethod::firstOrFail(),
            message: 'Retrieved default shipping option successfully.'
        );
    }
}

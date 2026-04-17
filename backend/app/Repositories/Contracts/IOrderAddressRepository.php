<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\OrderAddress;

interface IOrderAddressRepository
{
    public function createOrderAddress(array $data): OrderAddress;
}

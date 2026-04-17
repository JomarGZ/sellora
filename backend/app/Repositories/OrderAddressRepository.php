<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\OrderAddress;
use App\Repositories\Contracts\IOrderAddressRepository;

final class OrderAddressRepository extends BaseRepository implements IOrderAddressRepository
{
    public function __construct(OrderAddress $orderAddress)
    {
        parent::__construct($orderAddress);
    }

    public function createOrderAddress(array $data): OrderAddress
    {
        return $this->model->create($data);
    }
}

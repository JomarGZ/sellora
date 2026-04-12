<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\UserAddress;

interface IUserAddressRepository
{
    public function findWithRelations(int $id): UserAddress;
}

<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\UserAddress;

interface IUserAddressRepository
{
    public function create(array $data);

    public function findWithRelations(int $id): ?UserAddress;

    public function unsetOtherDefaults(int $userId, int $addressId): void;

    public function setAsDefault(int $addressId): UserAddress;

    public function findByIdAndUser(int $addressId, int $userId): ?UserAddress;

    public function hasDefault(int $userId): bool;
}

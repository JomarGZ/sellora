<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\UserAddress;
use Illuminate\Support\Collection;

interface IUserAddressRepository
{
    public function list(int $userId): Collection;

    public function create(array $data);

    public function update(int $id, array $data);

    public function delete(int $id);

    public function findWithRelations(int $id): ?UserAddress;

    public function unsetOtherDefaults(int $userId, int $addressId): void;

    public function setAsDefault(int $addressId): UserAddress;

    public function findByIdAndUser(int $addressId, int $userId): ?UserAddress;

    public function hasDefault(int $userId): bool;

    public function countByUser(int $userId);
}

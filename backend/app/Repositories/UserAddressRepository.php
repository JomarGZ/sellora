<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\UserAddress;
use Illuminate\Support\Collection;

final class UserAddressRepository extends BaseRepository
{
    public function __construct(UserAddress $userAddress)
    {
        parent::__construct($userAddress);
    }

    public function list(int $userId): Collection
    {
        return $this->model->query()
            ->with(['country', 'city'])
            ->where('user_id', $userId)
            ->get();
    }

    public function findWithRelations(int $id): UserAddress
    {
        return $this->model->query()
            ->with(['country', 'city'])
            ->findOrFail($id);
    }

    public function unsetOtherDefaults(int $userId, int $addressId): void
    {
        $this->model->where('user_id', $userId)
            ->where('is_default', true)
            ->where('id', '!=', $addressId)
            ->update(['is_default' => false]);
    }

    public function setAsDefault(int $addressId): UserAddress
    {
        $address = $this->model->findOrFail($addressId);
        $address->update(['is_default' => true]);

        return $address;
    }

    public function findByIdAndUser(int $addressId, int $userId): ?UserAddress
    {
        return $this->model->query()->where('id', $addressId)
            ->with(['country', 'city'])
            ->where('user_id', $userId)
            ->first();
    }

    public function getDefault(int $userId): ?UserAddress
    {
        return $this->model->query()->where('user_id', $userId)->where('is_default', true)->firstOrFail();
    }

    public function hasDefault(int $userId): bool
    {
        return $this->model->query()->where('user_id', $userId)
            ->where('is_default', true)
            ->exists();
    }

    public function countByUser(int $userId)
    {
        return $this->model->where('user_id', $userId)->count();
    }
}

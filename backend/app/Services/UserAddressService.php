<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\Contracts\IUserAddressRepository;
use Exception;
use Illuminate\Support\Facades\DB;

final class UserAddressService
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        private IUserAddressRepository $repository
    ) {}

    public function setDefault(int $userId, int $addressId)
    {
        return DB::transaction(function () use ($userId, $addressId) {
            $address = $this->repository->findByIdAndUser(addressId: $addressId, userId: $userId);

            if (! $address) {
                throw new Exception('Address not found.');
            }
            $this->repository->unsetOtherDefaults(userId: $userId, addressId: $addressId);

            return $this->repository->setAsDefault(addressId: $addressId);
        });
    }

    public function create(int $userId, array $data)
    {
        $data['is_default'] = ! $this->repository->hasDefault($userId);

        return $this->repository->create([
            ...$data,
            'user_id' => $userId,
        ]);
    }
}

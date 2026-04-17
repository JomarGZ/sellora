<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\Contracts\IUserAddressRepository;
use DomainException;
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

            $this->repository->unsetOtherDefaults(userId: $userId, addressId: $addressId);

            return $this->repository->setAsDefault(addressId: $addressId);
        });
    }

    public function create(int $userId, array $data)
    {
        $count = $this->repository->countByUser($userId);

        if ($count >= config('app.user_max_addresses')) {
            throw new DomainException('You have reached the maximum number of addresses');
        }
        $data['is_default'] = ! $this->repository->hasDefault($userId);

        return $this->repository->create([
            ...$data,
            'user_id' => $userId,
        ]);
    }

    public function update(int $userId, int $addressId, array $data)
    {
        return DB::transaction(function () use ($userId, $addressId, $data) {
            if (array_key_exists('is_default', $data) && $data['is_default'] === true) {
                $this->repository->unsetOtherDefaults($userId, $addressId);
            }

            return $this->repository->update($addressId, $data);
        });
    }
}

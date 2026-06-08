<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\Contracts\IUserRepository;
use App\Repositories\UserAddressRepository;
use DomainException;
use Illuminate\Support\Facades\DB;

final class UserAddressService
{
    /**
     * Create a new class instance.
     */
    public function __construct(
        private UserAddressRepository $userAddressRepository,
        private IUserRepository $userRepository
    ) {}

    public function setDefault(int $userId, int $addressId)
    {
        $user = $this->userRepository->find($userId);
        if ($user->default_address_id === $addressId) {
            return;
        }
        $user->update([
            'default_address_id' => $addressId
        ]);

        return $user->defaultAddress;
    }

    public function create(int $userId, array $data)
    {
        $count = $this->userAddressRepository->countByUser($userId);

        if ($count >= config('app.user_max_addresses')) {
            throw new DomainException('You have reached the maximum number of addresses');
        }

        return DB::transaction(function () use ($data, $userId) {
            $user = $this->userRepository->find($userId);
            $defaultAddress = $user->defaultAddress;
            $userAddress = $this->userAddressRepository->create([
                ...$data,
                'user_id' => $user->id,
            ]);

            if (!$defaultAddress) {
                $user->update([
                    'default_address_id' => $userAddress->id
                ]);
            }

            return $userAddress;
        });
    }

    public function update(int $userId, int $addressId, array $data)
    {
        return DB::transaction(function () use ($userId, $addressId, $data) {
            if (array_key_exists('is_default', $data) && $data['is_default'] === true) {
                $this->userAddressRepository->unsetOtherDefaults($userId, $addressId);
            }

            return $this->userAddressRepository->update($addressId, $data);
        });
    }

    public function deleteAddress(int $userId, int $addressId)
    {
        $user = $this->userRepository->find($userId);
        $defaultAddress = $user->defaultAddress;

        if($defaultAddress && $defaultAddress->id === $user->default_address_id) {

        }
    }
}

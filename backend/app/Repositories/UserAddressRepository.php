<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\UserAddress;
use App\Repositories\Contracts\IUserAddressRepository;

final class UserAddressRepository extends BaseRepository implements IUserAddressRepository
{
    public function __construct(UserAddress $userAddress)
    {
        parent::__construct($userAddress);
    }

    public function findWithRelations(int $id): UserAddress
    {
        return $this->model->query()
            ->with(['country', 'city'])
            ->findOrFail($id);
    }
}

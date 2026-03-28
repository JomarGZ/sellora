<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

final class UserRepository extends BaseRepository
{
    public function __construct(User $user)
    {
        parent::__construct($user);
    }

    /**
     * Create a new user with hashed password and default role.
     *
     * @param array<string, mixed> $userData
     */
    public function createUser($userData): User
    {
        $userData['password'] = Hash::make($userData['password']);
        $userData['role_id'] ??= 1;

        return parent::create($userData);
    }

    public function updateUser($id, array $userData)
    {
        if (isset($userData['password'])) {
            $userData['password'] = Hash::make($userData['password']);
            unset($userData['password_confirmation']);
        }

        return parent::update($id, $userData);
    }

    public function checkEmailExists($email): bool
    {
        return $this->model->whereEmail($email)->count() > 0;
    }

    public function paginateUsers(int $perPage)
    {
        return parent::paginate($perPage);
    }
}

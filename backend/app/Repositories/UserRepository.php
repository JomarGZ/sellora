<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use InvalidArgumentException;

/**
 * @extends BaseRepository<User>
 */
final class UserRepository extends BaseRepository
{
    public function __construct(User $user)
    {
        parent::__construct($user);
    }

    /**
     * Create a new user with hashed password and default role.
     *
     * @param  array<string, mixed>  $userData
     *
     * @throws InvalidArgumentException if password is missing or not a string
     */
    public function createUser(array $userData): User
    {
        // Ensure password exists and is a string
        throw_if(! isset($userData['password']) || ! is_string($userData['password']), InvalidArgumentException::class, 'Password must be provided as a string.');

        // Hash the password
        $userData['password'] = Hash::make($userData['password']);

        // Set default role if not provided
        $userData['role_id'] ??= 1;

        /** @var User $user */
        $user = parent::create($userData);

        return $user;
    }

    /**
     * Update an existing user, optionally hashing the password.
     *
     * @param  int  $id  User ID
     * @param  array<string, mixed>  $userData
     *
     * @throws InvalidArgumentException if password is set but not a string
     */
    public function updateUser(int $id, array $userData): User
    {
        if (isset($userData['password'])) {
            throw_unless(is_string($userData['password']), InvalidArgumentException::class, 'Password must be a string.');

            $userData['password'] = Hash::make($userData['password']);
            unset($userData['password_confirmation']);
        }

        /** @var User $user */
        $user = parent::update($id, $userData);

        return $user;
    }

    public function checkEmailExists(string $email): bool
    {
        return $this->model->whereEmail($email)->count() > 0;
    }

    /**
     * @return LengthAwarePaginator<int, User>
     */
    public function paginateUsers(int $perPage): LengthAwarePaginator
    {
        return parent::paginate($perPage);
    }
}

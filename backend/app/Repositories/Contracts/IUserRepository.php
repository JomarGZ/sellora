<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface IUserRepository extends IRepository
{
    public function createUser(array $userData): User;

    public function updateUser(int $id, array $userData): User;

    public function checkEmailExists(string $email): bool;
    
    public function paginateUsers(int $perPage): LengthAwarePaginator;
}

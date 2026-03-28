<?php

declare(strict_types=1);

namespace App\Repositories;

interface IRepository
{
    /**
     * Get all records from the repository.
     *
     * @return mixed
     */
    public function all();

    /**
     * Find a record by its ID.
     *
     * @return mixed
     */
    public function find(int $id);

    /**
     * Create a new record in the repository.
     *
     * @param  array<string, mixed>  $data
     * @return mixed
     */
    public function create(array $data);

    /**
     * Update a record in the repository.
     *
     * @param  array<string, mixed>  $data
     * @return mixed
     */
    public function update(int $id, array $data);

    /**
     * Delete a record from the repository.
     *
     * @return mixed
     */
    public function delete(int $id);
}

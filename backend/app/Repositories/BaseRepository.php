<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Contracts\IRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * @template TModel of Model
 */
abstract class BaseRepository implements IRepository
{
    /**
     * @param  TModel  $model
     */
    public function __construct(protected Model $model) {}

    final public function all()
    {
        return $this->model->all();
    }

    /**
     * @return TModel|null
     */
    final public function find(int $id)
    {
        return $this->model->find($id); // @phpstan-ignore-line
    }

    /**
     * @param  array<string, mixed>  $data
     * @return TModel
     */
    final public function create(array $data)
    {
        return $this->model->create($data); // @phpstan-ignore-line
    }

    /**
     * @param  array<string, mixed>  $data
     * @return TModel
     */
    final public function update(int $id, array $data)
    {
        $record = $this->model->find($id);

        throw_unless($record, RuntimeException::class, sprintf('Record with ID %d not found.', $id));

        $record->update($data);

        return $record->fresh(); // @phpstan-ignore-line
    }

    final public function delete(int $id)
    {
        return $this->model->destroy($id);
    }

    /**
     * @return LengthAwarePaginator<int, TModel>
     */
    final public function paginate(int $perPage): LengthAwarePaginator
    {
        return $this->model->paginate($perPage); // @phpstan-ignore-line
    }

    /**
     * @param  int|array<int>  $id
     */
    final public function checkIsExists(int|array $id): bool
    {
        if (is_array($id)) {
            return $this->model->whereIn('id', $id)->exists();
        }

        return $this->model->whereKey($id)->exists();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function format(array $data): array
    {
        $saveCopy = [];

        foreach ($data as $key => $value) {
            $saveCopy[Str::snake($key)] = $value;
        }

        return $saveCopy;
    }
}

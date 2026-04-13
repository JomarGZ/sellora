<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\V1\StoreUserAddressRequest;
use App\Http\Requests\V1\UpdateUserAddressRequest;
use App\Http\Resources\V1\UserAddressResource;
use App\Models\UserAddress;
use App\Repositories\Contracts\IUserAddressRepository;
use App\Services\UserAddressService;
use Illuminate\Support\Facades\Gate;

final class UserAddressController extends ApiController
{
    public function __construct(
        private readonly UserAddressService $service,
        private readonly IUserAddressRepository $repository
    ) {}

    public function index()
    {
        return $this->success(
            data: UserAddressResource::collection($this->repository->list(auth()->id())),
            message: 'User addresses retrieved successfully'
        );

    }

    public function store(StoreUserAddressRequest $request)
    {
        $address = $this->service->create(
            auth()->id(),
            $request->validated()
        );

        return $this->created(
            data: new UserAddressResource($address),
            message: 'Address created successfully.'
        );

    }

    public function update(UserAddress $userAddress, UpdateUserAddressRequest $request)
    {
        Gate::authorize('update', $userAddress);
        $updatedAddress = $this->service->update(
            userId: auth()->id(),
            addressId: $userAddress->id,
            data: $request->validated()
        );

        return $this->success(
            data: new UserAddressResource($updatedAddress),
            message: 'User address updated successfully.'
        );
    }

    public function destroy(UserAddress $userAddress)
    {
        Gate::authorize('delete', $userAddress);
        $this->repository->delete($userAddress->id);

        return $this->success(message: 'Address deleted successfully.');
    }

    public function setDefault(UserAddress $userAddress)
    {
        Gate::authorize('update', $userAddress);
        $address = $this->service->setDefault(
            userId: auth()->id(),
            addressId: $userAddress->id
        );

        return $this->success(
            data: new UserAddressResource($address),
            message: 'Set default address successfully.'
        );
    }
}

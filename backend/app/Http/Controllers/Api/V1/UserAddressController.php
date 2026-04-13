<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\V1\StoreUserAddressRequest;
use App\Http\Resources\V1\UserAddressResource;
use App\Services\UserAddressService;

final class UserAddressController extends ApiController
{
    public function __construct(
        private readonly UserAddressService $service
    ) {}

    public function index() {}

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

    public function update() {}

    public function destroy() {}

    public function setDefault(int $id)
    {
        $address = $this->service->setDefault(
            userId: auth()->id(),
            addressId: $id
        );

        return $this->success(
            data: new UserAddressResource($address),
            message: 'Set default address successfully.'
        );
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\V1\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Throwable;

class UserController extends ApiController
{
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
        ]);
        $user->fill($validated);

        if ($user->isDirty()) {
            $user->save();
        }

        return $this->success(
            data: UserResource::make($user),
            message: "Profile updated successfully."
        );
    }

    public function updateAvatar(Request $request) {
        $user = $request->user();

        $request->validate([
            'avatar' => ['required', 'image', 'max:2048']
        ]);

        $file = $request->file('avatar');

        $oldAvatar = $user->avatar;

       try {
            $path = $file->store('avatars', 'public');

            $user->update(['avatar' => $path]);

            if ($oldAvatar) {
                Storage::disk('public')->delete($oldAvatar);
            }

            return $this->success(
                data: [
                    'avatar_url' => asset(Storage::url($path)),
                ],
                message: "User avatar uploaded successfully."
            );

       } catch (Throwable $e) {
            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return $this->error('Failed to update avatar.', 500);
       }

    }
}

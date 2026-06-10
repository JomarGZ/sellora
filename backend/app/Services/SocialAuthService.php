<?php

namespace App\Services;

use App\Models\SocialAccount;
use App\Models\User;

class SocialAuthService
{
    public function findOrCreateUser($provider, $socialUser)
    {
        $account = SocialAccount::where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if ($account) {
            return $account->user;
        }

        $user = User::where('email', $socialUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
            'first_name' => $socialUser->getName() ? $socialUser->getName() : $socialUser->user['given_name'] ?? 'google User',
                'email' => $socialUser->getEmail(),
                'avatar' => $socialUser->getAvatar(),
                'email_verified_at' => now(),
            ]);
        }

        $user->socialAccounts()->create([
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
        ]);

        return $user;
    }
}
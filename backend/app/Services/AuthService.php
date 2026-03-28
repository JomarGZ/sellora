<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\TokenAbility;
use App\Models\User;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

final readonly class AuthService
{
    public function __construct(
        private UserRepository $userRepository,
    ) {}

    /**
     * @param array{
     *     name: string,
     *     email: string,
     *     password: string
     * } $userData
     */
    public function doRegistration(array $userData): User
    {
        throw_if($this->userRepository->checkEmailExists($userData['email']), Exception::class, 'The email is already taken.');

        return $this->userRepository->createUser($userData);
    }

    /**
     * Generate access and refresh tokens for a user.
     *
     * @return array{
     *     accessToken: string,
     *     refreshToken: string,
     * }
     */
    public function generateTokens(User $user): array
    {
        $expiration = config('sanctum.expiration');
        $accessTokenMinutes = is_int($expiration) ? $expiration : 15;

        $rtExpiration = config('sanctum.rt_expiration');
        $refreshTokenMinutes = is_int($rtExpiration) ? $rtExpiration : (24 * 60);

        $accessTokenExpiresAt = now()->addMinutes($accessTokenMinutes);
        $refreshTokenExpiresAt = now()->addMinutes($refreshTokenMinutes);
        // Create tokens
        $accessToken = $user->createToken(
            'access_token',
            [TokenAbility::ACCESS_API],
            $accessTokenExpiresAt
        );

        $refreshToken = $user->createToken(
            'refresh_token',
            [TokenAbility::ISSUE_ACCESS_TOKEN],
            $refreshTokenExpiresAt
        );

        return [
            'accessToken' => $accessToken->plainTextToken,
            'refreshToken' => $refreshToken->plainTextToken,
        ];
    }

    public function sendResetPasswordLink(string $email): string
    {
        return Password::sendResetLink([
            'email' => $email,
        ]);
    }

    /**
     * Reset the user's password.
     *
     * @param  array<string, string>  $userData
     * @return string Password reset status
     */
    public function doPasswordReset(array $userData): string
    {
        /** @var string $status Laravel always returns a string constant */
        $status = Password::reset(
            $userData,
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        return $status;
    }
}

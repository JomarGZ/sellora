<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Api\V1\ForgotPasswordRequest;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\RegisterRequest;
use App\Http\Requests\Api\V1\ResendVerificationRequest;
use App\Http\Requests\Api\V1\ResetPasswordRequest;
use App\Http\Requests\Api\V1\VerifyEmailRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuthService;
use Exception;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Symfony\Component\HttpFoundation\Response;

final class AuthController extends ApiController
{
    public function __construct(
        private readonly AuthService $service
    ) {}
    public function register(RegisterRequest $request): JsonResponse
    {
        /** @var array{name: string, email: string, password: string} $userData */
        $userData = $request->validated();

        try {
            $user = $this->service->doRegistration($userData);
        } catch (Exception $exception) {
            return $this->error(message: $exception->getMessage());
        }

        $tokens = $this->service->generateTokens($user);

        $response = $this->created([
            'user' => new UserResource($user),
            'accessToken' => $tokens['accessToken'],
        ], 'User registered successfully. Please check your email to verify your account.');

        $response->withCookie($this->refreshTokenCookie($tokens['refreshToken']));

        return $response;

    }

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();
        if (! Auth::attempt($credentials)) {
            return $this->error(message: 'Wrong credentials.', code: Response::HTTP_UNAUTHORIZED);
        }

        $user = Auth::user();
        if (! $user instanceof User) {
            return $this->error('Unauthenticated.', 401);
        }

        if ($user->is_admin) {
            Auth::logout();

            return $this->error(message: 'Access denied', code: Response::HTTP_FORBIDDEN);
        }

        $tokens = $this->service->generateTokens($user);

        $response = $this->success(message: 'You have successfully logged in.', data: [
            'user' => UserResource::make($user),
            'accessToken' => $tokens['accessToken'],
        ]);

        $response->withCookie($this->refreshTokenCookie($tokens['refreshToken']));

        return $response;
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->tokens()->delete();

        $response = $this->success(message: 'Successfully logged out.');
        
        $response->withCookie(
            cookie()->forget('refreshToken')
        );

        return $response;
    }

    public function refresh(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $user->tokens()->delete();
        $tokens = $this->service->generateTokens($user);
       
        $response = $this->success(message: 'Token refreshed successfully', data: [
            'user' => UserResource::make($user),
            'accessToken' => $tokens['accessToken'],
        ]);

        $response->withCookie($this->refreshTokenCookie($tokens['refreshToken']));

        return $response;
    }

    public function verifyEmail(VerifyEmailRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $this->success(message: 'Email already verified');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return $this->success(message: 'Email verified successfully');
    }

    public function resendVerificationEmail(ResendVerificationRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->email)->first();

        if (! $user) {
            return $this->notFound('User not found');
        }

        if ($user->hasVerifiedEmail()) {
            return $this->error('Email already verified', 400);
        }

        $user->sendEmailVerificationNotification();

        return $this->success(message: 'Verification email sent successfully');
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return $this->success(message: 'Password reset link sent to your email');
        }

        return $this->error('Unable to send reset link', 500);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->success(message: 'Password reset successfully');
        }

        return $this->error(
            match ($status) {
                Password::INVALID_TOKEN => 'Invalid or expired reset token',
                Password::INVALID_USER => 'User not found',
                default => 'Unable to reset password',
            },
            400
        );
    }

    private function refreshTokenCookie(string $refreshToken)
    {
        $rtExpiration = config('sanctum.rt_expiration');
        $refreshTokenMinutes = is_int($rtExpiration) ? $rtExpiration : (24 * 60);

        return cookie(
            'refreshToken',
            $refreshToken,
            $refreshTokenMinutes,
            secure: false,
            httpOnly: true,
            sameSite: 'lax'
        );
    }

}

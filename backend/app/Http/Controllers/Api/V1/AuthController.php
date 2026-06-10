<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Requests\Api\V1\ChangePasswordRequest;
use App\Http\Requests\Api\V1\ForgotPasswordRequest;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\RegisterRequest;
use App\Http\Requests\Api\V1\ResendVerificationRequest;
use App\Http\Requests\Api\V1\ResetPasswordRequest;
use App\Http\Requests\Api\V1\VerifyEmailRequest;
use App\Http\Resources\V1\UserResource;
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

        $response->withCookie($this->service->refreshTokenCookie($tokens['refreshToken']));

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

        $response = $this->success(data: [
            'user' => UserResource::make($user),
            'accessToken' => $tokens['accessToken'],
        ], message: 'You have successfully logged in.');

        $response->withCookie($this->service->refreshTokenCookie($tokens['refreshToken']));

        return $response;
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()->delete();

        $response = $this->success(message: 'Successfully logged out.');

        $response->withCookie(
            cookie()->forget('refreshToken')
        );

        return $response;
    }

    public function refresh(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()->delete();

        $user = $request->user();

        abort_unless($user instanceof User, 401, 'Unauthenticated.');

        $tokens = $this->service->generateTokens($user);
        $response = $this->success(data: [
            'user' => UserResource::make($user),
            'accessToken' => $tokens['accessToken'],
        ], message: 'Token refreshed successfully');
        $response->withCookie($this->service->refreshTokenCookie($tokens['refreshToken']));

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
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return $this->error('User not found', 404);
        }

        // create password reset token
        $token = Password::createToken($user);

        // TODO: send email (custom notification or mail class)
        // $user->notify(new ResetPasswordNotification($token));

        return $this->success(
            message: 'Password reset token generated',
            data: [
                'email' => $user->email,
                'token' => $token, // optional: remove this in production if using email only
            ]
        );
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        $user = $request->user();
        if (! $user->canChangePassword()) {
            return $this->error(
                message: 'Password changes are not available for accounts signed in through a social provider.',
                code: 422
            );
        }
        if (!Hash::check($request->current_password, $user->password)) {
            return $this->error('Current password is incorrect', 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        $user->tokens()->delete();

        return $this->success(message: 'Password changed successfully.');
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

    
}

<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Services\SocialAuthService;
use Laravel\Socialite\Socialite;

class SocialAuthController extends Controller
{

    public function __construct(
        private readonly SocialAuthService $service,
        private readonly  AuthService $authService
    ) {}

    public function redirect()
    {
        return Socialite::driver('google')
            ->stateless()
            ->redirect();
    }
     public function callback(SocialAuthService $service)
    {
        $googleUser = Socialite::driver('google')
            ->stateless()
            ->user();

         $user = $service->findOrCreateUser(
            'google',
            $googleUser
        );

        $tokens = $this->authService->generateTokens($user);

        $response = redirect(config('app.frontend_url'));

        $response->withCookie(
            $this->authService->refreshTokenCookie($tokens['refreshToken'])
        );

        return $response;
    }
}

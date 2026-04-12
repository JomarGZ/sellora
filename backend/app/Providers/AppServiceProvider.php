<?php

declare(strict_types=1);

namespace App\Providers;

use App\Enums\TokenAbility;
use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\SecurityScheme;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\PersonalAccessToken;
use Laravel\Sanctum\Sanctum;

final class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $this->configureRateLimiting();
        $this->overrideSanctumConfigurationToSupportRefreshToken();
        Scramble::configure()
            ->withDocumentTransformers(function (OpenApi $openApi) {
                $openApi->secure(
                    SecurityScheme::http('bearer')
                );
            });
    }

    private function configureRateLimiting(): void
    {
        RateLimiter::for(
            'api',
            fn (Request $request) => Limit::perMinute(60)
                ->by($request->user()?->id ?: $request->ip())
        );

        RateLimiter::for(
            'auth',
            fn (Request $request) => Limit::perMinute(5)
                ->by(mb_strtolower(is_string($request->input('email')) ? $request->input('email') : 'guest'))
                ->response(fn () => response()->json([
                    'message' => 'Too many login attempts. Try again in 60 seconds.',
                ], 429))
        );

        RateLimiter::for(
            'authenticated',
            fn (Request $request) => $request->user()
                ? Limit::perMinute(120)->by($request->user()->id)
                : Limit::perMinute(60)->by($request->ip())
        );
    }

    private function overrideSanctumConfigurationToSupportRefreshToken(): void
    {
        Sanctum::$accessTokenAuthenticationCallback = function (PersonalAccessToken $accessToken, bool $isValid): bool {
            $abilities = collect($accessToken->abilities);

            if ($abilities[0] === TokenAbility::ISSUE_ACCESS_TOKEN->value) {
                return $accessToken->expires_at !== null && $accessToken->expires_at->isFuture();
            }

            return $isValid;
        };

        Sanctum::$accessTokenRetrievalCallback = function (Request $request): string {
            if (! $request->routeIs('api.v1.refresh.token')) {
                $header = $request->header('Authorization');

                return is_string($header) ? str_replace('Bearer ', '', $header) : '';
            }

            $cookie = $request->cookie('refreshToken');

            return is_string($cookie) ? $cookie : '';
        };
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureCustomer
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user || (bool) $user->is_admin) {
            return response()->json(['message' => 'Forbiddin. Customers only.'], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}

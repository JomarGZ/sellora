<?php

declare(strict_types=1);

namespace App\Services;

use Stripe\Checkout\Session;
use Stripe\Stripe;

final class StripeService
{
    public function createCheckoutSession(array $payload): Session
    {
        Stripe::setApiKey(config('stripe.secret_key'));

        return Session::create($payload);
    }

    public function retrieveSession(string $sessionId)
    {
        Stripe::setApiKey(config('stripe.secret_key'));

        return Session::retrieve($sessionId);
    }
}

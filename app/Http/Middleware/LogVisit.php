<?php

namespace App\Http\Middleware;

use App\Models\Visit;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogVisit
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $sessionId = $request->session()->getId();
        $fingerprint = sha1(($request->ip() ?? 'unknown') . ($request->userAgent() ?? 'na'));

        $alreadyLogged = Visit::query()
            ->whereDate('visited_at', today())
            ->where(function ($query) use ($sessionId, $fingerprint) {
                $query->where('session_id', $sessionId)
                    ->orWhere('fingerprint', $fingerprint);
            })
            ->exists();

        if (! $alreadyLogged) {
            Visit::create([
                'user_id' => optional($request->user())->id,
                'session_id' => $sessionId,
                'fingerprint' => $fingerprint,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'landing_page' => $request->path(),
                'referrer' => $request->headers->get('referer'),
                'visited_at' => now(),
            ]);
        }

        return $response;
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitController extends Controller
{
    public function log(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'landing_page' => ['nullable', 'string', 'max:255'],
            'referrer' => ['nullable', 'string', 'max:255'],
        ]);

        $sessionId = $request->session()->getId();
        $fingerprint = sha1(($request->ip() ?? 'unknown') . ($request->userAgent() ?? 'na'));

        $alreadyLogged = Visit::query()
            ->whereDate('visited_at', today())
            ->where(function ($query) use ($sessionId, $fingerprint) {
                $query->where('session_id', $sessionId)
                    ->orWhere('fingerprint', $fingerprint);
            })
            ->exists();

        if (!$alreadyLogged) {
            Visit::create([
                'user_id' => optional($request->user())->id,
                'session_id' => $sessionId,
                'fingerprint' => $fingerprint,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'landing_page' => $validated['landing_page'] ?? $request->path(),
                'referrer' => $validated['referrer'] ?? $request->headers->get('referer'),
                'visited_at' => now(),
            ]);

            return response()->json([
                'message' => 'Visit logged successfully',
            ]);
        }

        return response()->json([
            'message' => 'Visit already logged today',
        ]);
    }

    public function stats(): JsonResponse
    {
        $stats = [
            'total' => Visit::count(),
            'today' => Visit::whereDate('visited_at', today())->count(),
        ];

        return response()->json($stats);
    }
}



<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
| Note: The frontend is built with Next.js and runs separately.
| All client-facing routes are handled by Next.js.
| API routes are defined in routes/api.php
|
*/

// Log visit middleware route (can be called from Next.js)
Route::post('/api/log-visit', function () {
    // This will be handled by middleware if needed
    return response()->json(['message' => 'Visit logged']);
})->middleware('log.visit');

// Language switch route for Filament/Backend
Route::get('/lang/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'ar'])) {
        Session::put('locale', $locale);

        // Also update cookie for Next.js frontend
        $cookie = cookie('language', $locale, 60 * 24 * 365, null, null, false, false);

        if (auth()->check()) {
            auth()->user()->forceFill(['preferred_locale' => $locale])->save();
        }

        return redirect()->back()->withCookie($cookie);
    }
    return redirect()->back();
})->name('switch-language');

// Language switch API endpoint
Route::post('/api/lang/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'ar'])) {
        session()->put('locale', $locale);
        if (auth()->check()) {
            auth()->user()->forceFill(['preferred_locale' => $locale])->save();
        }
        return response()->json(['message' => 'Language updated', 'locale' => $locale]);
    }
    return response()->json(['error' => 'Invalid locale'], 400);
})->name('api.switch-language');

// Test email route (for development)
Route::get('/test-email', function () {
    try {
        \Illuminate\Support\Facades\Mail::raw('This is a test email from Laravel!', function ($message) {
            $message->to('oaa259@gmail.com')
                    ->subject('Test Email');
        });
        return 'Email sent! Check your inbox at oaa259@gmail.com';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

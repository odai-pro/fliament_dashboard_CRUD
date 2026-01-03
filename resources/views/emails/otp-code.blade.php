<x-mail::message>
# {{ __('mail.otp.subject', ['app' => config('app.name')]) }}

{{ __('mail.otp.intro') }}

<x-mail::panel>
<div style="text-align: center; font-size: 2rem; letter-spacing: 0.3rem; font-weight: bold;">
{{ $code }}
</div>
</x-mail::panel>

{{ __('mail.otp.expires', ['seconds' => $expiresInSeconds]) }}

{{ __('mail.otp.footer') }}

{{ config('app.name') }}
</x-mail::message>

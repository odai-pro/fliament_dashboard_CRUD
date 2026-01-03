<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpCodeMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly string $code,
        public readonly string $purpose,
        public readonly string $recipientName,
        public readonly int $expiresInSeconds = 60,
    ) {
        //
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.otp.subject', [
                'app' => config('app.name'),
            ]),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.otp-code',
            with: [
                'code' => $this->code,
                'purpose' => $this->purpose,
                'recipientName' => $this->recipientName,
                'expiresInSeconds' => $this->expiresInSeconds,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

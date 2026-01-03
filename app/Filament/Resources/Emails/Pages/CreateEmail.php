<?php

namespace App\Filament\Resources\Emails\Pages;

use App\Filament\Resources\Emails\EmailResource;
use Filament\Resources\Pages\CreateRecord;

class CreateEmail extends CreateRecord
{
    protected static string $resource = EmailResource::class;

    protected function afterCreate(): void
    {
        $email = $this->record;
        
        try {
            \Illuminate\Support\Facades\Mail::send([], [], function ($message) use ($email) {
                $message->to($email->recipient_email)
                        ->subject($email->subject)
                        ->html($email->message);
                
                // Attach files if any
                if ($email->attachments) {
                    foreach ($email->attachments as $attachment) {
                        $message->attach(storage_path('app/public/' . $attachment));
                    }
                }
            });
            
            // Update status to sent
            $email->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);
            
            \Filament\Notifications\Notification::make()
                ->title('Email Sent Successfully!')
                ->success()
                ->send();
                
        } catch (\Exception $e) {
            // Update status to failed
            $email->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
            
            \Filament\Notifications\Notification::make()
                ->title('Failed to Send Email')
                ->body($e->getMessage())
                ->danger()
                ->send();
        }
    }
}

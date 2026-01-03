<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;
use Filament\Notifications\Notification;
use App\Notifications\UserInteractionNotification;

class TestNotificationWidget extends Widget
{
    protected string $view = 'filament.widgets.test-notification-widget';
    
    protected int | string | array $columnSpan = 'full';

    public function sendTestNotification()
    {
        $user = auth()->user();
        
        // Send the notification using our custom class (Email + Database + Broadcast)
        $user->notify(new UserInteractionNotification(
            'Test Notification System',
            'This is a test message sent at ' . now()->toDateTimeString(),
            url('/admin')
        ));

        // Show a confirmation toast in the UI
        Notification::make()
            ->title('Notification Sent!')
            ->body('Check your email and the notification bell.')
            ->success()
            ->send();
    }
}

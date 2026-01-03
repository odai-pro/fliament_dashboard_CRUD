<x-filament-widgets::widget>
    <x-filament::section>
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-lg font-bold">Notification System Test</h2>
                <p class="text-gray-500">Click the button to test Email, Database, and Pusher notifications.</p>
            </div>
            <x-filament::button wire:click="sendTestNotification">
                Send Test Notification
            </x-filament::button>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>

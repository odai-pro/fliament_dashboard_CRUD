<div
    x-data="{ loading: false }"
    x-on:livewire:navigating.window="loading = true"
    x-on:livewire:navigated.window="loading = false"
    x-on:livewire:loading.window="loading = true"
    x-on:livewire:load.window="loading = false"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300"
    x-show="loading"
    x-transition:enter="ease-out duration-300"
    x-transition:enter-start="opacity-0"
    x-transition:enter-end="opacity-100"
    x-transition:leave="ease-in duration-200"
    x-transition:leave-start="opacity-100"
    x-transition:leave-end="opacity-0"
    style="display: none;"
>
    <div class="flex flex-col items-center space-y-4">
        <div class="relative h-16 w-16">
            <div class="absolute inset-0 rounded-full border-4 border-gray-200 opacity-25"></div>
            <div class="absolute inset-0 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
        <span class="text-lg font-medium text-white shadow-sm">Loading...</span>
    </div>
</div>

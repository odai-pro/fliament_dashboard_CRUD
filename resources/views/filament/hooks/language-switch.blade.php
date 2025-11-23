<div class="flex items-center gap-x-4">
    @if (app()->getLocale() === 'ar')
        <a href="{{ route('switch-language', 'en') }}" class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            English
        </a>
    @else
        <a href="{{ route('switch-language', 'ar') }}" class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            العربية
        </a>
    @endif
</div>

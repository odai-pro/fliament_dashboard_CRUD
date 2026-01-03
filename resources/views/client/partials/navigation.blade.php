<nav class="sticky top-0 z-40 backdrop-blur-xl bg-app-panel/80 border-b border-app-border">
    <div class="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div class="flex items-center justify-between gap-4">
            {{-- Logo Section --}}
            <a href="{{ route('client.home') }}" class="flex items-center gap-2 md:gap-3 group flex-shrink-0">
                <img src="{{ asset('logo.png') }}" alt="{{ config('app.name') }}" class="h-10 md:h-12 w-auto object-contain">
                <div class="hidden sm:block">
                    <p class="font-semibold text-xs md:text-sm uppercase tracking-[0.2rem] md:tracking-[0.3rem] text-brand-gold">Auvéa</p>
                    <p class="text-[10px] md:text-xs text-app-muted">{{ __('client.brand.descriptor') }}</p>
                </div>
            </a>

            {{-- Navigation Links (Center) --}}
            <div class="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-xs xl:text-sm uppercase tracking-wide flex-1 justify-center">
                <a href="#visits" class="nav-link" data-scroll-to>{{ __('client.nav.home') }}</a>
                <a href="#showcase" class="nav-link" data-scroll-to>{{ __('client.nav.showcase') }}</a>
                <a href="#stories" class="nav-link" data-scroll-to>{{ __('client.nav.stories') }}</a>
                <a href="#contact" class="nav-link" data-scroll-to>{{ __('client.nav.contact') }}</a>
            </div>

            {{-- Right Section: Icons & Buttons --}}
            <div class="flex items-center gap-2 md:gap-4 flex-shrink-0">
                {{-- Theme Toggle - Switch Style --}}
                <div class="theme-toggle-switch-wrapper relative" data-theme-toggle-container>
                    <div class="theme-toggle-switch-track relative w-16 h-8 md:w-20 md:h-10 rounded-full bg-gradient-to-r from-[#2d2d2d] via-[#1a1a1a] to-[#2d2d2d] border border-[#c8a46d]/30 shadow-lg cursor-pointer transition-all duration-500 hover:border-[#c8a46d]/50 overflow-visible" data-theme-track style="transform-style: preserve-3d; perspective: 1000px;">
                        {{-- Sliding Toggle Button --}}
                        <div class="theme-toggle-switch-slider absolute top-1 left-1 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-[#c8a46d] via-[#d4b87f] to-[#a0824d] shadow-lg shadow-[#c8a46d]/50 transition-all duration-500 ease-in-out flex items-center justify-center" data-theme-slider style="transform-style: preserve-3d;">
                            {{-- Moon Icon (shown in dark mode) --}}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 md:w-4 md:h-4 text-[#0a0602] absolute theme-icon" data-theme-icon="moon" style="transform-style: preserve-3d; backface-visibility: hidden;">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                            </svg>
                            {{-- Sun Icon (shown in light mode) --}}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 md:w-4 md:h-4 text-[#0a0602] absolute theme-icon opacity-0" data-theme-icon="sun" style="transform-style: preserve-3d; backface-visibility: hidden;">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                            </svg>
                        </div>
                        {{-- Sun dot indicator (right side) --}}
                        <div class="absolute top-1/2 right-2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#c8a46d]/40" data-theme-sun-dot></div>
                    </div>
                </div>

                {{-- Language Switcher --}}
                <div class="flex rounded-full border border-app-border overflow-hidden text-[10px] md:text-xs font-semibold">
                    <a href="{{ route('switch-language', 'en') }}" class="px-2 md:px-3 py-1 transition-colors {{ app()->getLocale() === 'en' ? 'bg-app-ink text-app-base' : 'text-app-muted hover:bg-app-border/30' }}">EN</a>
                    <a href="{{ route('switch-language', 'ar') }}" class="px-2 md:px-3 py-1 transition-colors {{ app()->getLocale() === 'ar' ? 'bg-app-ink text-app-base' : 'text-app-muted hover:bg-app-border/30' }}">AR</a>
                </div>

                {{-- Auth Buttons --}}
                @auth
                    <form action="{{ route('client.logout') }}" method="POST" class="hidden sm:block">
                        @csrf
                        <button type="submit" class="btn btn-danger text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">
                            {{ __('client.auth.logout') }}
                        </button>
                    </form>
                @else
                    <div class="hidden sm:flex gap-2">
                        <a href="{{ route('client.login') }}" class="btn btn-ghost text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">{{ __('client.auth.login') }}</a>
                        <a href="{{ route('client.register') }}" class="btn btn-primary text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">{{ __('client.auth.register') }}</a>
                    </div>
                @endauth
            </div>
        </div>

        {{-- Mobile Navigation Links --}}
        <div class="lg:hidden mt-3 pt-3 border-t border-app-border">
            <div class="flex items-center justify-center gap-4 text-xs font-medium uppercase tracking-wide">
                <a href="#visits" class="nav-link py-1" data-scroll-to>{{ __('client.nav.home') }}</a>
                <a href="#showcase" class="nav-link py-1" data-scroll-to>{{ __('client.nav.showcase') }}</a>
                <a href="#stories" class="nav-link py-1" data-scroll-to>{{ __('client.nav.stories') }}</a>
                <a href="#contact" class="nav-link py-1" data-scroll-to>{{ __('client.nav.contact') }}</a>
            </div>

            {{-- Mobile Auth Buttons --}}
            @auth
                <form action="{{ route('client.logout') }}" method="POST" class="sm:hidden mt-3">
                    @csrf
                    <button type="submit" class="btn btn-danger text-xs w-full">
                        {{ __('client.auth.logout') }}
                    </button>
                </form>
            @else
                <div class="sm:hidden flex gap-2 mt-3">
                    <a href="{{ route('client.login') }}" class="btn btn-ghost text-xs flex-1 text-center">{{ __('client.auth.login') }}</a>
                    <a href="{{ route('client.register') }}" class="btn btn-primary text-xs flex-1 text-center">{{ __('client.auth.register') }}</a>
                </div>
            @endauth
        </div>
    </div>
</nav>

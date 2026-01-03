import './bootstrap';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Theme Management - follows system preference by default
    const root = document.documentElement;
    const storageKey = 'ui_theme';

    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (theme) => {
        root.dataset.theme = theme;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        console.log('Theme applied:', theme);
    };

    // Check if user has manually set a theme, otherwise use system preference
    const storedTheme = localStorage.getItem(storageKey);
    const initialTheme = storedTheme || getSystemTheme();
    applyTheme(initialTheme);

    // Listen for system theme changes (only if user hasn't manually set a preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(storageKey)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Function to update theme toggle visual state
    const updateThemeToggleState = () => {
        const currentTheme = root.dataset.theme || (root.classList.contains('dark') ? 'dark' : 'light');
        const slider = document.querySelector('[data-theme-slider]');
        const track = document.querySelector('[data-theme-track]');
        const moonIcon = document.querySelector('[data-theme-icon="moon"]');
        const sunIcon = document.querySelector('[data-theme-icon="sun"]');
        const sunDot = document.querySelector('[data-theme-sun-dot]');
        
        if (!slider || !track) return;
        
        if (currentTheme === 'dark') {
            // Dark mode: slider on left, show moon
            slider.style.transform = 'translateX(0) scale(1)';
            slider.style.background = 'linear-gradient(135deg, #c8a46d, #d4b87f, #a0824d)';
            track.style.background = 'linear-gradient(to right, #2d2d2d, #1a1a1a, #2d2d2d)';
            track.style.borderColor = 'rgba(200, 164, 109, 0.3)';
            
            // Moon comes forward
            if (moonIcon) {
                moonIcon.style.opacity = '1';
                moonIcon.style.transform = 'scale(1) rotate(0deg) translateZ(0)';
                moonIcon.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
            // Sun goes behind
            if (sunIcon) {
                sunIcon.style.opacity = '0';
                sunIcon.style.transform = 'scale(0.3) rotate(180deg) translateZ(-30px)';
            }
            if (sunDot) sunDot.style.opacity = '0.4';
        } else {
            // Light mode: slider on right, show sun
            const trackWidth = track.offsetWidth || 80;
            const sliderWidth = slider.offsetWidth || 32;
            const translateX = trackWidth - sliderWidth - 4;
            slider.style.transform = `translateX(${translateX}px) scale(1)`;
            slider.style.background = 'linear-gradient(135deg, #ffd700, #ffed4e, #ffb347)';
            track.style.background = 'linear-gradient(to right, #f5f1e8, #faf8f3, #f5f1e8)';
            track.style.borderColor = 'rgba(200, 164, 109, 0.5)';
            
            // Moon goes behind
            if (moonIcon) {
                moonIcon.style.opacity = '0';
                moonIcon.style.transform = 'scale(0.3) rotate(180deg) translateZ(-30px)';
            }
            // Sun comes forward
            if (sunIcon) {
                sunIcon.style.opacity = '1';
                sunIcon.style.transform = 'scale(1) rotate(0deg) translateZ(0)';
                sunIcon.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
            if (sunDot) sunDot.style.opacity = '0';
        }
    };
    
    // Initialize toggle state
    setTimeout(updateThemeToggleState, 100);
    
    // Setup click handler
    const toggleContainer = document.querySelector('[data-theme-toggle-container]');
    const toggleTrack = document.querySelector('[data-theme-track]');
    const clickTarget = toggleContainer || toggleTrack;
    
    if (clickTarget) {
        clickTarget.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const currentTheme = root.dataset.theme || (root.classList.contains('dark') ? 'dark' : 'light');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            const slider = document.querySelector('[data-theme-slider]');
            const moonIcon = document.querySelector('[data-theme-icon="moon"]');
            const sunIcon = document.querySelector('[data-theme-icon="sun"]');
            
            // Professional 3D animation - icons come from behind
            if (nextTheme === 'dark' && moonIcon && sunIcon) {
                // Sun goes behind first
                sunIcon.style.opacity = '0';
                sunIcon.style.transform = 'scale(0.3) rotate(180deg) translateZ(-30px)';
                sunIcon.style.transition = 'all 0.4s ease';
                
                // Moon comes from behind
                moonIcon.style.opacity = '0';
                moonIcon.style.transform = 'scale(0.3) rotate(-180deg) translateZ(-30px)';
                moonIcon.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                
                setTimeout(() => {
                    moonIcon.style.opacity = '1';
                    moonIcon.style.transform = 'scale(1) rotate(0deg) translateZ(0)';
                }, 50);
            } else if (nextTheme === 'light' && moonIcon && sunIcon) {
                // Moon goes behind first
                moonIcon.style.opacity = '0';
                moonIcon.style.transform = 'scale(0.3) rotate(180deg) translateZ(-30px)';
                moonIcon.style.transition = 'all 0.4s ease';
                
                // Sun comes from behind
                sunIcon.style.opacity = '0';
                sunIcon.style.transform = 'scale(0.3) rotate(-180deg) translateZ(-30px)';
                sunIcon.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                
                setTimeout(() => {
                    sunIcon.style.opacity = '1';
                    sunIcon.style.transform = 'scale(1) rotate(0deg) translateZ(0)';
                }, 50);
            }
            
            applyTheme(nextTheme);
            localStorage.setItem(storageKey, nextTheme);
            
            setTimeout(updateThemeToggleState, 100);
        });
    }
    
    // Update toggle state when theme changes
    const observer = new MutationObserver(() => {
        updateThemeToggleState();
    });
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    
    // Update on window resize
    window.addEventListener('resize', () => {
        updateThemeToggleState();
    });
});
document.querySelectorAll('[data-scroll-to]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
        const href = trigger.getAttribute('href');
        if (!href || !href.startsWith('#')) {
            return;
        }

        event.preventDefault();
        const section = document.querySelector(href);
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// IntersectionObserver reveal animation
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
        },
    );

    revealElements.forEach((el) => observer.observe(el));
}

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('[data-mobile-menu-toggle]');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

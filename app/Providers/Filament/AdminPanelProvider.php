<?php

namespace App\Providers\Filament;

use Filament\Panel;
use BezhanSalleh\FilamentShield\FilamentShieldPlugin;
use Filament\PanelProvider;

/**
 * Filament Shield يبحث عن Provider باسم AdminPanelProvider.
 * هذا الملف يوجه الطلب إلى JewelaryPanelProvider الموجود مسبقاً.
 */
class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        // إعادة استخدام إعدادات اللوحة الموجودة في JewelaryPanelProvider
        return (new JewelaryPanelProvider)->panel($panel);
    }
}

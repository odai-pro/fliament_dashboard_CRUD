<?php

namespace App\Filament\Widgets;

use App\Models\ContactMessage;
use App\Models\Order;
use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make(__('dashboard.stats.total_products'), Product::count())
                ->icon('heroicon-o-shopping-bag')
                ->color('success'),

            Stat::make(__('dashboard.stats.total_orders'), Order::count())
                ->icon('heroicon-o-shopping-cart')
                ->color('warning'),

            Stat::make(__('dashboard.stats.total_sales'), '$' . number_format(Order::sum('total_amount'), 2))
                ->icon('heroicon-o-currency-dollar')
                ->color('success'),

            Stat::make(__('dashboard.stats.pending_orders'), Order::where('status', 'pending')->count())
                ->icon('heroicon-o-clock')
                ->color('danger'),

            Stat::make(__('dashboard.stats.unread_messages'), ContactMessage::where('status', 'unread')->count())
                ->icon('heroicon-o-envelope')
                ->color('info'),
        ];
    }
}

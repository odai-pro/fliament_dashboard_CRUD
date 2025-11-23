<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class SalesChart extends ChartWidget
{
    protected static ?int $sort = 2;

    public function getHeading(): string
    {
        return __('dashboard.charts.sales_over_time');
    }

    protected function getData(): array
    {
        $data = Order::selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => __('dashboard.charts.sales'),
                    'data' => $data->pluck('total')->toArray(),
                    'fill' => 'start',
                    'borderColor' => '#eab308',
                    'backgroundColor' => 'rgba(234, 179, 8, 0.1)',
                ],
            ],
            'labels' => $data->pluck('date')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}

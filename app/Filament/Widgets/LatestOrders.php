<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestOrders extends BaseWidget
{
    protected static ?int $sort = 3;
    
    protected int | string | array $columnSpan = 2;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Order::query()->latest()->limit(5)
            )
            ->heading(__('dashboard.latest_orders.title'))
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->label(__('orders.fields.number'))
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label(__('orders.fields.customer'))
                    ->searchable(),
                Tables\Columns\TextColumn::make('total_amount')
                    ->label(__('orders.fields.total'))
                    ->money(),
                Tables\Columns\TextColumn::make('status')
                    ->label(__('orders.fields.status'))
                    ->badge(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('common.created_at'))
                    ->dateTime(),
            ]);
    }
}

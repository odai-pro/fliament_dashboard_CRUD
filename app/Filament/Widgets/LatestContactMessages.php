<?php

namespace App\Filament\Widgets;

use App\Models\ContactMessage;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestContactMessages extends BaseWidget
{
    protected static ?int $sort = 4;
    
    protected int | string | array $columnSpan = 2;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                ContactMessage::query()->latest()->limit(5)
            )
            ->heading(__('dashboard.latest_contact_messages.title'))
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label(__('contact_messages.fields.name'))
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label(__('contact_messages.fields.email'))
                    ->searchable(),
                Tables\Columns\TextColumn::make('subject')
                    ->label(__('contact_messages.fields.subject')),
                Tables\Columns\TextColumn::make('status')
                    ->label(__('contact_messages.fields.status'))
                    ->badge(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('common.created_at'))
                    ->dateTime(),
            ]);
    }
}

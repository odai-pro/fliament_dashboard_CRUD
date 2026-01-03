<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

use Illuminate\Database\Eloquent\Builder;

use Filament\Tables\Columns\ImageColumn;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->with(['category', 'media']))
            ->columns([
                ImageColumn::make('image')
                    ->label(__('products.attributes.image'))
                    ->state(function ($record) {
                        $firstMedia = $record->getFirstMedia('images');
                        if ($firstMedia) {
                            $url = $firstMedia->getUrl();
                            // Ensure absolute URL
                            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                                $url = url($url);
                            }
                            return $url;
                        }
                        return null;
                    })
                    ->circular()
                    ->defaultImageUrl(url('/images/placeholder.jpg'))
                    ->extraAttributes(['class' => 'object-cover']),
                TextColumn::make('name')
                    ->translateLabel()
                    ->searchable()
                    ->sortable(),
                TextColumn::make('category.name')
                    ->label(__('products.attributes.category_id')) // Use category name instead of ID for better UX
                    ->sortable(),

                TextColumn::make('sku')
                    ->label('SKU')
                    ->translateLabel()
                    ->searchable(),
                TextColumn::make('price')
                    ->translateLabel()
                    ->money()
                    ->sortable(),
                TextColumn::make('weight')
                    ->translateLabel()
                    ->numeric()
                    ->suffix(' g')
                    ->sortable(),
                TextColumn::make('discount_price')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                TextColumn::make('file_format')
                    ->translateLabel()
                    ->searchable(),
                TextColumn::make('file_size')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                IconColumn::make('is_featured')
                    ->translateLabel()
                    ->boolean(),
                IconColumn::make('is_active')
                    ->translateLabel()
                    ->boolean(),
                TextColumn::make('downloads_count')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                TextColumn::make('views_count')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->translateLabel()
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->translateLabel()
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('deleted_at')
                    ->translateLabel()
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}

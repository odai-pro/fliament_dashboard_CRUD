<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('category_id')
                    ->translateLabel()
                    ->required()
                    ->numeric(),
                TextInput::make('name')
                    ->translateLabel()
                    ->required(),
                TextInput::make('description')
                    ->translateLabel()
                    ->required(),
                TextInput::make('sku')
                    ->label('SKU')
                    ->translateLabel()
                    ->required(),
                TextInput::make('price')
                    ->translateLabel()
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('discount_price')
                    ->translateLabel()
                    ->numeric(),
                TextInput::make('file_format')
                    ->translateLabel(),
                TextInput::make('file_size')
                    ->translateLabel()
                    ->numeric(),
                TextInput::make('specifications')
                    ->translateLabel(),
                Toggle::make('is_featured')
                    ->translateLabel()
                    ->required(),
                Toggle::make('is_active')
                    ->translateLabel()
                    ->required(),
                TextInput::make('downloads_count')
                    ->translateLabel()
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('views_count')
                    ->translateLabel()
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}

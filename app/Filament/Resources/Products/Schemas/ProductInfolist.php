<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ProductInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('category_id')
                    ->numeric(),
                TextEntry::make('sku')
                    ->label('SKU'),
                TextEntry::make('price')
                    ->money(),
                TextEntry::make('discount_price')
                    ->numeric(),
                TextEntry::make('file_format'),
                TextEntry::make('file_size')
                    ->numeric(),
                IconEntry::make('is_featured')
                    ->boolean(),
                IconEntry::make('is_active')
                    ->boolean(),
                TextEntry::make('downloads_count')
                    ->numeric(),
                TextEntry::make('views_count')
                    ->numeric(),
                TextEntry::make('created_at')
                    ->dateTime(),
                TextEntry::make('updated_at')
                    ->dateTime(),
                TextEntry::make('deleted_at')
                    ->dateTime(),
            ]);
    }
}

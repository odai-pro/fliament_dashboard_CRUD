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
                \Filament\Infolists\Components\ImageEntry::make('image')
                    ->label(__('products.attributes.image'))
                    ->state(function ($record) {
                        $firstMedia = $record->getFirstMedia('images');
                        if ($firstMedia) {
                            $url = $firstMedia->getUrl();
                            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                                $url = url($url);
                            }
                            return $url;
                        }
                        return null;
                    })
                    ->defaultImageUrl(url('/images/placeholder.jpg'))
                    ->columnSpanFull(),
                \Filament\Infolists\Components\ImageEntry::make('preview_images')
                    ->label(__('products.attributes.preview_images'))
                    ->state(function ($record) {
                        return $record->getMedia('preview_images')->map(function ($media) {
                            $url = $media->getUrl();
                            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                                $url = url($url);
                            }
                            return $url;
                        })->toArray();
                    })
                    ->columnSpanFull(),
                TextEntry::make('3d_file_name')
                    ->label(__('products.attributes.3d_file'))
                    ->state(fn ($record) => $record->getFirstMedia('3d_files')?->file_name ?? '-')
                    ->columnSpanFull(),
                TextEntry::make('category.name')
                    ->label(__('products.attributes.category_id')),
                TextEntry::make('name')
                    ->translateLabel(),
                 TextEntry::make('description')
                    ->translateLabel()
                    ->columnSpanFull(),
                TextEntry::make('sku')
                    ->translateLabel(),
                TextEntry::make('price')
                    ->translateLabel()
                    ->money(),
                TextEntry::make('weight')
                    ->translateLabel()
                    ->numeric()
                    ->suffix(' g'),
                TextEntry::make('discount_price')
                    ->translateLabel()
                    ->numeric(),
                TextEntry::make('file_format')
                    ->translateLabel(),
                TextEntry::make('file_size')
                    ->translateLabel()
                    ->numeric(),
                IconEntry::make('is_featured')
                    ->translateLabel()
                    ->boolean(),
                IconEntry::make('is_active')
                    ->translateLabel()
                    ->boolean(),
                TextEntry::make('downloads_count')
                    ->translateLabel()
                    ->numeric(),
                TextEntry::make('views_count')
                    ->translateLabel()
                    ->numeric(),
                TextEntry::make('created_at')
                    ->translateLabel()
                    ->dateTime(),
                TextEntry::make('updated_at')
                    ->translateLabel()
                    ->dateTime(),
            ]);
    }
}

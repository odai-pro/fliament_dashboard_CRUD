<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                FileUpload::make('image_upload')
                    ->label(__('products.attributes.image'))
                    ->multiple()
                    ->reorderable()
                    ->image()
                    ->disk('public')
                    ->directory('products/images')
                    ->visibility('public')
                    ->dehydrated(false)
                    ->columnSpanFull(),
                FileUpload::make('preview_images_upload')
                    ->label(__('products.attributes.preview_images'))
                    ->multiple()
                    ->reorderable()
                    ->image()
                    ->disk('public')
                    ->directory('products/preview_images')
                    ->visibility('public')
                    ->dehydrated(false)
                    ->columnSpanFull(),
                FileUpload::make('3d_file_upload')
                    ->label(__('products.attributes.3d_file'))
                    ->acceptedFileTypes(['model/gltf-binary', 'application/octet-stream'])
                    ->disk('public')
                    ->directory('products/3d_files')
                    ->visibility('public')
                    ->dehydrated(false)
                    ->columnSpanFull(),
                Select::make('category_id')
                    ->translateLabel()
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('name')
                    ->translateLabel()
                    ->required(),
                TextInput::make('description')
                    ->translateLabel()
                    ->required(),
                TextInput::make('sku')
                    ->translateLabel()
                    ->required(),
                TextInput::make('price')
                    ->translateLabel()
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('weight')
                    ->translateLabel()
                    ->numeric()
                    ->suffix('g')
                    ->helperText('Weight in grams'),
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

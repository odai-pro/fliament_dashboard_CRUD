<?php

namespace App\Filament\Resources\Emails\Schemas;

use Filament\Schemas\Schema;

class EmailForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Forms\Components\TextInput::make('recipient_email')
                    ->label('Recipient Email')
                    ->email()
                    ->required()
                    ->placeholder('customer@example.com'),
                
                \Filament\Forms\Components\TextInput::make('subject')
                    ->label('Subject')
                    ->required()
                    ->placeholder('Email subject'),
                
                \Filament\Forms\Components\RichEditor::make('message')
                    ->label('Message')
                    ->required()
                    ->columnSpanFull(),
                
                \Filament\Forms\Components\FileUpload::make('attachments')
                    ->label('Attachments')
                    ->multiple()
                    ->directory('email-attachments')
                    ->maxSize(10240)
                    ->columnSpanFull(),
            ]);
    }
}

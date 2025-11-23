<?php

namespace App\Filament\Pages;

use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Form;
use Filament\Pages\Page;
use Filament\Notifications\Notification;
use App\Models\SiteSetting;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Actions\Action;



class SiteSettings extends Page
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.site-settings';


    public static function getNavigationLabel(): string
    {
        return __('settings.site.title');
    }

    public static function getNavigationGroup(): ?string
    {
        return __('settings.site.group');
    }

    public function getTitle(): string
    {
        return __('settings.site.title');
    }

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'site_name_ar' => SiteSetting::get('site_name_ar', ''),
            'site_name_en' => SiteSetting::get('site_name_en', ''),
            'site_description_ar' => SiteSetting::get('site_description_ar', ''),
            'site_description_en' => SiteSetting::get('site_description_en', ''),
            'contact_email' => SiteSetting::get('contact_email', ''),
            'contact_phone' => SiteSetting::get('contact_phone', ''),
            'facebook_url' => SiteSetting::get('facebook_url', ''),
            'twitter_url' => SiteSetting::get('twitter_url', ''),
            'instagram_url' => SiteSetting::get('instagram_url', ''),
            'whatsapp_number' => SiteSetting::get('whatsapp_number', ''),
        ]);
    }

    protected function getFormSchema(): array
    {
        return [
            TextInput::make('site_name_ar')
                ->label(__('site_name_ar'))
                ->required(),
            TextInput::make('site_name_en')
                ->label(__('site_name_en'))
                ->required(),
            Textarea::make('site_description_ar')
                ->label(__('site_description_ar'))
                ->rows(3),
            Textarea::make('site_description_en')
                ->label(__('site_description_en'))
                ->rows(3),
            TextInput::make('contact_email')
                ->label(__('contact_email'))
                ->email()
                ->required(),
            TextInput::make('contact_phone')
                ->label(__('contact_phone'))
                ->tel(),
            TextInput::make('whatsapp_number')
                ->label(__('whatsapp_number'))
                ->tel(),
            TextInput::make('facebook_url')
                ->label(__('facebook_url'))
                ->url(),
            TextInput::make('twitter_url')
                ->label(__('twitter_url'))
                ->url(),
            TextInput::make('instagram_url')
                ->label(__('instagram_url'))
                ->url(),
        ];
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            SiteSetting::set($key, $value);
        }

        Notification::make()
            ->title(__('settings.site.saved'))
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label(__('common.actions.save'))
                ->submit('save'),
        ];
    }
}

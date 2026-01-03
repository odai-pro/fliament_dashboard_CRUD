<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'preferred_locale' => 'ar',
            'prefers_dark_mode' => true,
        ]);

        $this->command->info('✅ Test user created successfully!');
        $this->command->info('📧 Email: test@example.com');
        $this->command->info('🔑 Password: password123');
    }
}

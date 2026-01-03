<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // إنشاء أو الحصول على role admin
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin']);

        // إنشاء أو تحديث مستخدم Admin
        $admin = User::firstOrCreate(
            ['email' => 'oaa259@gmail.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('1234567'),
                'email_verified_at' => now(),
            ]
        );

        // إعطاء المستخدم صلاحية super_admin
        if (!$admin->hasRole('super_admin')) {
            $admin->assignRole('super_admin');
        }
    }
}

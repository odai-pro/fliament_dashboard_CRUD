<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'preferred_locale',
        'prefers_dark_mode',
        'layout_seed', // Added
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'otp_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'prefers_dark_mode' => 'boolean',
            'password' => 'hashed',
            'layout_seed' => 'integer', // Added
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (is_null($user->layout_seed)) {
                $user->layout_seed = rand(1, 1000000);
            }
        });
    }

    public function canAccessPanel(\Filament\Panel $panel): bool
    {
        $allowedEmails = collect(explode(',', (string) env('ADMIN_EMAILS', 'oaa259@gmail.com')))
            ->map(fn ($email) => trim($email))
            ->filter()
            ->all();

        return in_array($this->email, $allowedEmails, true)
            || $this->hasAnyRole(['super_admin', 'admin']);
    }

    /**
     * Get the orders for the user.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}

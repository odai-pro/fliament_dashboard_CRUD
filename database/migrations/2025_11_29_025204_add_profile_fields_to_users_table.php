<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('preferred_locale', 5)->default('en')->after('password');
            $table->boolean('prefers_dark_mode')->default(false)->after('preferred_locale');
            $table->timestamp('otp_verified_at')->nullable()->after('prefers_dark_mode');
            $table->timestamp('last_login_at')->nullable()->after('otp_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'preferred_locale',
                'prefers_dark_mode',
                'otp_verified_at',
                'last_login_at',
            ]);
        });
    }
};

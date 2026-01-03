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
            $table->integer('layout_seed')->nullable()->after('email');
        });

        // Generate seeds for existing users
        \App\Models\User::chunk(100, function ($users) {
            foreach ($users as $user) {
                if (is_null($user->layout_seed)) {
                    $user->update(['layout_seed' => rand(1, 1000000)]);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('layout_seed');
        });
    }
};

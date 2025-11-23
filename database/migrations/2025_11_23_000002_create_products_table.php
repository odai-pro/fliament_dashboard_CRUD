<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->json('name');
            $table->json('description');
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->string('file_format')->nullable(); // نوع ملف الثري دي (STL, OBJ, etc.)
            $table->decimal('file_size', 8, 2)->nullable(); // حجم الملف بالميجابايت
            $table->json('specifications')->nullable(); // مواصفات إضافية
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('downloads_count')->default(0);
            $table->integer('views_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

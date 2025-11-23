<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;

class Product extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia, HasTranslations;

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'sku',
        'price',
        'discount_price',
        'file_format',
        'file_size',
        'specifications',
        'is_featured',
        'is_active',
        'downloads_count',
        'views_count',
    ];

    public $translatable = ['name', 'description', 'specifications'];

    protected $casts = [
        'specifications' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'file_size' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Media Collections
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->useFallbackUrl('/images/placeholder.jpg');

        $this->addMediaCollection('3d_files')
            ->singleFile();

        $this->addMediaCollection('preview_images');
    }

    // Helper to get final price
    public function getFinalPriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }
}

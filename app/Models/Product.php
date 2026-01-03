<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;
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
        'weight',
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
        'weight' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'file_size' => 'decimal:2',
    ];

    protected $attributes = [
        'is_active' => true,
        'is_featured' => false,
        'downloads_count' => 0,
        'views_count' => 0,
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
            ->disk('public')
            ->useFallbackUrl('/images/placeholder.jpg');

        $this->addMediaCollection('3d_files')
            ->disk('public')
            ->singleFile();

        $this->addMediaCollection('preview_images')
            ->disk('public');
    }

    // Helper to get final price
    public function getFinalPriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }

    /**
     * Get image URLs as absolute URLs
     */
    public function getImageUrlsAttribute(): array
    {
        return $this->getMedia('images')->map(function ($media) {
            $url = $media->getUrl();
            // Ensure absolute URL
            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                $url = url($url);
            }
            return $url;
        })->toArray();
    }

    /**
     * Get preview image URLs as absolute URLs
     */
    public function getPreviewImageUrlsAttribute(): array
    {
        return $this->getMedia('preview_images')->map(function ($media) {
            $url = $media->getUrl();
            // Ensure absolute URL
            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                $url = url($url);
            }
            return $url;
        })->toArray();
    }

    /**
     * Boot method to clear cache on model events
     */
    protected static function boot()
    {
        parent::boot();

        // Clear cache when product is created, updated, or deleted
        static::saved(function ($product) {
            static::clearProductCache($product);
        });

        static::deleted(function ($product) {
            static::clearProductCache($product);
        });
    }

    /**
     * Clear all product-related cache
     */
    protected static function clearProductCache($product = null)
    {
        // Clear products index cache (all variations)
        // Since cache keys are MD5 hashes, we need to clear all product-related cache
        // For better performance, we'll use cache tags if available, otherwise flush
        
        // Clear specific product cache if product ID is known
        if ($product && $product->id) {
            $locales = ['en', 'ar'];
            foreach ($locales as $locale) {
                Cache::forget("product_show_{$product->id}_{$locale}");
            }
        }
        
        // Clear all products index cache
        // Note: Since we use MD5 hashes, we can't easily target specific keys
        // In production, consider using cache tags for better control
        Cache::flush();
    }
}

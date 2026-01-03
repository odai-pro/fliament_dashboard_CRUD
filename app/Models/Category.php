<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;
use Spatie\Translatable\HasTranslations;

class Category extends Model
{
    use HasFactory, SoftDeletes, HasTranslations;

    protected $fillable = [
        'name',
        'description',
        'slug',
        'is_active',
        'sort_order',
    ];

    public $translatable = ['name', 'description'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'is_active' => true,
        'sort_order' => 0,
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Boot method to clear cache on model events
     */
    protected static function boot()
    {
        parent::boot();

        // Clear cache when category is created, updated, or deleted
        static::saved(function ($category) {
            static::clearCategoryCache($category);
        });

        static::deleted(function ($category) {
            static::clearCategoryCache($category);
        });
    }

    /**
     * Clear all category-related cache
     */
    protected static function clearCategoryCache($category = null)
    {
        // Clear specific category cache if category ID is known
        if ($category && $category->id) {
            $locales = ['en', 'ar'];
            foreach ($locales as $locale) {
                Cache::forget("category_show_{$category->id}_{$locale}");
                Cache::forget("categories_index_{$locale}");
            }
        } else {
            // Clear all categories cache
            $locales = ['en', 'ar'];
            foreach ($locales as $locale) {
                Cache::forget("categories_index_{$locale}");
            }
        }
        
        // Also clear products cache since products depend on categories
        Cache::flush();
    }
}

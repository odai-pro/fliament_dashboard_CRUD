<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $locale = $request->get('locale', app()->getLocale());
        
        $cacheKey = "categories_index_{$locale}";

        // $categories = Cache::remember($cacheKey, 60 * 60, function () use ($locale) {
            $categories = Category::withCount('products')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
                ->map(function ($category) use ($locale) {
                    return [
                        'id' => $category->id,
                        'name' => $category->getTranslation('name', $locale),
                        'description' => $category->getTranslation('description', $locale),
                        'slug' => $category->slug,
                        'products_count' => $category->products_count,
                        'sort_order' => $category->sort_order,
                    ];
                });
        // });

        return response()->json([
            'success' => true,
            'data' => $categories,
            'count' => $categories->count(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $locale = $request->get('locale', app()->getLocale());
        
        $cacheKey = "category_show_{$id}_{$locale}";

        $data = Cache::remember($cacheKey, 60 * 60, function () use ($id, $locale) {
            $category = Category::withCount('products')
                ->where('is_active', true)
                ->findOrFail($id);

            return [
                'id' => $category->id,
                'name' => $category->getTranslation('name', $locale),
                'description' => $category->getTranslation('description', $locale),
                'slug' => $category->slug,
                'products_count' => $category->products_count,
                'sort_order' => $category->sort_order,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}

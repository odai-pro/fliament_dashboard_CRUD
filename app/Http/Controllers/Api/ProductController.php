<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $locale = $request->get('locale', app()->getLocale());
        $categoryId = $request->get('category_id');
        $featured = $request->get('featured');
        $perPage = $request->get('per_page', 12); // Default 12 items per page
        $page = $request->get('page', 1);

        // Generate a unique cache key based on request parameters
        $cacheParams = serialize([$locale, $categoryId, $featured, $perPage, $page]);
        $cacheKey = "products_index_" . md5($cacheParams);

        // Cache for 60 minutes
        $result = Cache::remember($cacheKey, 60 * 60, function () use ($locale, $categoryId, $featured, $perPage) {
            $query = Product::with(['category', 'media'])
                ->where('is_active', true)
                ->whereHas('category', function($q) {
                    $q->where('is_active', true);
                });

            // Filter by category if provided
            if ($categoryId) {
                $query->where('category_id', $categoryId);
            }

            // Filter by featured if provided
            if ($featured !== null) {
                $query->where('is_featured', filter_var($featured, FILTER_VALIDATE_BOOLEAN));
            }

            // Order by featured first, then category
            $query->orderBy('is_featured', 'desc')
                  ->orderBy('category_id', 'asc')
                  ->orderBy('created_at', 'desc');

            // Use paginate instead of get
            $paginator = $query->paginate($perPage);

            // Transform the items
            $items = collect($paginator->items())->map(function ($product) use ($locale) {
                return [
                    'id' => $product->id,
                    'category_id' => $product->category_id,
                    'category' => [
                        'id' => $product->category->id ?? null,
                        'name' => $product->category->getTranslation('name', $locale) ?? '',
                        'slug' => $product->category->slug ?? '',
                    ],
                    'name' => $product->getTranslation('name', $locale),
                    'description' => $product->getTranslation('description', $locale),
                    'sku' => $product->sku,
                    'price' => (float) $product->price,
                    'weight' => $product->weight ? (float) $product->weight : null,
                    'discount_price' => $product->discount_price ? (float) $product->discount_price : null,
                    'final_price' => (float) $product->final_price,
                    'file_format' => $product->file_format,
                    'file_size' => $product->file_size ? (float) $product->file_size : null,
                    'specifications' => $product->specifications ? $product->getTranslation('specifications', $locale) : null,
                    'is_featured' => $product->is_featured,
                    'images' => $product->getMedia('images')->map(function ($media) {
                        $url = $media->getUrl();
                        // Ensure absolute URL
                        if (!filter_var($url, FILTER_VALIDATE_URL)) {
                            $url = url($url);
                        }
                        return $url;
                    })->toArray(),
                    'preview_images' => $product->getMedia('preview_images')->map(function ($media) {
                        $url = $media->getUrl();
                        // Ensure absolute URL
                        if (!filter_var($url, FILTER_VALIDATE_URL)) {
                            $url = url($url);
                        }
                        return $url;
                    })->toArray(),
                    'downloads_count' => $product->downloads_count,
                    'views_count' => $product->views_count,
                    'created_at' => $product->created_at,
                    'updated_at' => $product->updated_at,
                ];
            });

            return [
                'data' => $items,
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ]
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $result['data'],
            'meta' => $result['meta'],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $locale = $request->get('locale', app()->getLocale());

        // Increment views count (don't cache this action)
        Product::where('id', $id)->increment('views_count');

        $cacheKey = "product_show_{$id}_{$locale}";

        $data = Cache::remember($cacheKey, 60 * 60, function () use ($id, $locale) {
            $product = Product::with(['category', 'media'])
                ->where('is_active', true)
                ->findOrFail($id);

            return [
                'id' => $product->id,
                'category_id' => $product->category_id,
                'category' => [
                    'id' => $product->category->id ?? null,
                    'name' => $product->category->getTranslation('name', $locale) ?? '',
                    'slug' => $product->category->slug ?? '',
                ],
                'name' => $product->getTranslation('name', $locale),
                'description' => $product->getTranslation('description', $locale),
                'sku' => $product->sku,
                'price' => (float) $product->price,
                'weight' => $product->weight ? (float) $product->weight : null,
                'discount_price' => $product->discount_price ? (float) $product->discount_price : null,
                'final_price' => (float) $product->final_price,
                'file_format' => $product->file_format,
                'file_size' => $product->file_size ? (float) $product->file_size : null,
                'specifications' => $product->specifications ? $product->getTranslation('specifications', $locale) : null,
                'is_featured' => $product->is_featured,
                'images' => $product->getMedia('images')->map(function ($media) {
                    $url = $media->getUrl();
                    // Ensure absolute URL
                    if (!filter_var($url, FILTER_VALIDATE_URL)) {
                        $url = url($url);
                    }
                    return $url;
                })->toArray(),
                'preview_images' => $product->getMedia('preview_images')->map(function ($media) {
                    $url = $media->getUrl();
                    // Ensure absolute URL
                    if (!filter_var($url, FILTER_VALIDATE_URL)) {
                        $url = url($url);
                    }
                    return $url;
                })->toArray(),
                '3d_file' => $product->getFirstMediaUrl('3d_files') ? (filter_var($product->getFirstMediaUrl('3d_files'), FILTER_VALIDATE_URL) ? $product->getFirstMediaUrl('3d_files') : url($product->getFirstMediaUrl('3d_files'))) : null,
                'downloads_count' => $product->downloads_count,
                'views_count' => $product->views_count,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ];
        });

        // Get fresh views_count from database to override cached value
        $freshViewsCount = Product::where('id', $id)->value('views_count');
        if ($freshViewsCount !== null) {
            $data['views_count'] = $freshViewsCount;
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}

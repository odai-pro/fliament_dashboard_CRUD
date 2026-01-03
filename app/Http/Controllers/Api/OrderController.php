<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Create a new order from cart
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'items' => ['required', 'array', 'min:1'],
                'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
                'items.*.quantity' => ['required', 'integer', 'min:1'],
                'items.*.price' => ['required', 'numeric', 'min:0'],
                'subtotal' => ['required', 'numeric', 'min:0'],
                'total' => ['required', 'numeric', 'min:0'],
                'customer_name' => ['required', 'string', 'max:255'],
                'customer_email' => ['required', 'email', 'max:255'],
                'customer_phone' => ['nullable', 'string', 'max:20'],
                'address' => ['nullable', 'string', 'max:500'],
                'city' => ['nullable', 'string', 'max:100'],
                'notes' => ['nullable', 'string', 'max:1000'],
                'payment_method' => ['required', 'string', 'in:cod'],
                'coupon_code' => ['nullable', 'string', 'max:50'],
            ]);

            $user = Auth::guard('sanctum')->user();

            // Get cart to verify items
            $cart = $this->getCart($request);
            if (!$cart || $cart->items->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => __('validation.cart_empty'),
                ], 400);
            }

            // Verify all products exist and are active
            $productIds = collect($validated['items'])->pluck('product_id')->unique();
            $products = Product::whereIn('id', $productIds)
                ->where('is_active', true)
                ->get()
                ->keyBy('id');

            if ($products->count() !== $productIds->count()) {
                return response()->json([
                    'success' => false,
                    'message' => __('validation.some_products_invalid'),
                ], 400);
            }

            // Calculate totals from actual product prices
            $calculatedSubtotal = 0;
            $calculatedTotal = 0;

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['product_id']);
                if (!$product) {
                    return response()->json([
                        'success' => false,
                        'message' => __('validation.product_not_found', ['id' => $item['product_id']]),
                    ], 404);
                }

                $itemPrice = $product->final_price;
                $itemTotal = $itemPrice * $item['quantity'];
                $calculatedSubtotal += $itemTotal;
            }

            // Apply coupon discount if exists
            $discountAmount = 0;
            if (!empty($validated['coupon_code']) && $cart->coupon_code === $validated['coupon_code']) {
                // TODO: Calculate discount from coupon model when implemented
                // For now, use the difference between subtotal and total
                $discountAmount = max(0, $calculatedSubtotal - $validated['total']);
            }

            $calculatedTotal = $calculatedSubtotal - $discountAmount;

            // Verify totals match (with small tolerance for floating point)
            if (abs($calculatedTotal - $validated['total']) > 0.01) {
                return response()->json([
                    'success' => false,
                    'message' => __('validation.total_mismatch'),
                ], 400);
            }

            DB::beginTransaction();

            try {
                // Create order
                $order = Order::create([
                    'user_id' => $user?->id,
                    'total_amount' => $calculatedTotal,
                    'status' => 'pending',
                    'payment_status' => 'pending',
                    'payment_method' => $validated['payment_method'],
                    'notes' => $validated['notes'] ?? 'Digital Download Order',
                ]);

                // Create order items
                foreach ($validated['items'] as $item) {
                    $product = $products->get($item['product_id']);
                    $locale = $request->get('locale', app()->getLocale());

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->getTranslation('name', $locale),
                        'price' => $product->final_price,
                        'quantity' => $item['quantity'],
                    ]);

                    // Increment downloads count (for digital products)
                    $product->increment('downloads_count');
                }

                // Clear cart after successful order
                $cart->items()->delete();
                $cart->coupon_code = null;
                $cart->save();

                DB::commit();

                // TODO: Send email with download links
                // TODO: Trigger download link generation

                return response()->json([
                    'success' => true,
                    'message' => __('orders.order_created_successfully'),
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'data' => [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'total_amount' => $order->total_amount,
                        'status' => $order->status,
                        'created_at' => $order->created_at,
                    ],
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Order creation failed', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => __('orders.order_creation_failed'),
                ], 500);
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => __('validation.validation_failed'),
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('Order creation error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => __('orders.order_creation_failed'),
            ], 500);
        }
    }

    /**
     * Get user's orders
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::guard('sanctum')->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => __('auth.unauthenticated'),
                ], 401);
            }

            $orders = Order::where('user_id', $user->id)
                ->with('items.product')
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 15));

            $locale = $request->get('locale', app()->getLocale());

            $formattedOrders = $orders->map(function ($order) use ($locale) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => (float) $order->total_amount,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'payment_method' => $order->payment_method,
                    'items_count' => $order->items->count(),
                    'created_at' => $order->created_at,
                    'items' => $order->items->map(function ($item) use ($locale) {
                        return [
                            'id' => $item->id,
                            'product_id' => $item->product_id,
                            'product_name' => $item->product_name,
                            'price' => (float) $item->price,
                            'quantity' => $item->quantity,
                            'total' => (float) $item->total,
                        ];
                    }),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedOrders,
                'meta' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total(),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Orders fetch error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => __('orders.fetch_failed'),
            ], 500);
        }
    }

    /**
     * Get single order details
     */
    public function show(Request $request, string $id): JsonResponse
    {
        try {
            $user = Auth::guard('sanctum')->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => __('auth.unauthenticated'),
                ], 401);
            }

            $order = Order::where('id', $id)
                ->where('user_id', $user->id)
                ->with('items.product')
                ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => __('orders.order_not_found'),
                ], 404);
            }

            $locale = $request->get('locale', app()->getLocale());

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => (float) $order->total_amount,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'payment_method' => $order->payment_method,
                    'notes' => $order->notes,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                    'items' => $order->items->map(function ($item) use ($locale) {
                        $product = $item->product;
                        return [
                            'id' => $item->id,
                            'product_id' => $item->product_id,
                            'product_name' => $item->product_name,
                            'price' => (float) $item->price,
                            'quantity' => $item->quantity,
                            'total' => (float) $item->total,
                            'product' => $product ? [
                                'id' => $product->id,
                                'name' => $product->getTranslation('name', $locale),
                                'sku' => $product->sku,
                                'images' => $product->getMedia('images')->map(function ($media) {
                                    return url($media->getUrl());
                                })->toArray(),
                            ] : null,
                        ];
                    }),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Order fetch error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => __('orders.fetch_failed'),
            ], 500);
        }
    }

    /**
     * Get cart helper method
     */
    private function getCart(Request $request): ?Cart
    {
        $user = Auth::guard('sanctum')->user();

        if ($user) {
            $cart = Cart::where('user_id', $user->id)->first();
            if ($cart) {
                $cart->load('items.product');
            }
            return $cart;
        }

        $sessionId = $request->header('X-Session-ID');
        if (!$sessionId) {
            return null;
        }

        $cart = Cart::where('session_id', $sessionId)
            ->whereNull('user_id')
            ->first();

        if ($cart) {
            $cart->load('items.product');
        }

        return $cart;
    }
}


<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CartController extends Controller
{
    private function getCart(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        
        if ($user) {
            // Authenticated user
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);
            
            // Merge session cart if exists
            if ($request->header('X-Session-ID')) {
                $sessionCart = Cart::where('session_id', $request->header('X-Session-ID'))
                                 ->whereNull('user_id')
                                 ->first();
                
                if ($sessionCart) {
                    foreach ($sessionCart->items as $item) {
                        $existingItem = $cart->items()->where('product_id', $item->product_id)->first();
                        if ($existingItem) {
                            $existingItem->quantity += $item->quantity;
                            $existingItem->save();
                        } else {
                            $cart->items()->create([
                                'product_id' => $item->product_id,
                                'quantity' => $item->quantity
                            ]);
                        }
                    }
                    $sessionCart->delete();
                }
            }
            
            return $cart;
        } else {
            // Guest user
            $sessionId = $request->header('X-Session-ID');
            if (!$sessionId || !is_string($sessionId) || strlen($sessionId) < 10) {
                // Return null with proper error handling - frontend should always provide session ID
                return null;
            }
            
            return Cart::firstOrCreate(['session_id' => $sessionId, 'user_id' => null]);
        }
    }

    public function index(Request $request)
    {
        try {
            $cart = $this->getCart($request);
            
            if (!$cart) {
                return response()->json([
                    'success' => true,
                    'items' => [],
                    'coupon_code' => null,
                    'subtotal' => 0,
                    'total' => 0,
                    'discount_amount' => 0,
                ]);
            }

        $cart->load('items.product'); // Eager load

        $items = $cart->items->map(function ($item) {
            $product = $item->product;
            
            if (!$product) {
                // Remove orphaned cart item
                $item->delete();
                return null;
            }
            // Format product data to match frontend expectation
            $images = $product->getMedia('images')->map(function ($media) {
                $url = $media->getUrl();
                // Ensure absolute URL
                if (!filter_var($url, FILTER_VALIDATE_URL)) {
                    $url = url($url);
                }
                return $url;
            })->toArray();

            $previewImages = $product->getMedia('preview_images')->map(function ($media) {
                $url = $media->getUrl();
                // Ensure absolute URL
                if (!filter_var($url, FILTER_VALIDATE_URL)) {
                    $url = url($url);
                }
                return $url;
            })->toArray();

            // Get translated fields
            $locale = request('locale', 'en');

            return [
                'id' => $product->id,
                'cart_item_id' => $item->id,
                'category_id' => $product->category_id,
                'category' => [
                    'id' => $product->category->id,
                    'name' => $product->category->getTranslation('name', $locale),
                    'slug' => $product->category->slug,
                ],
                'name' => $product->getTranslation('name', $locale),
                'description' => $product->getTranslation('description', $locale),
                'sku' => $product->sku,
                'price' => (float) $product->price,
                'weight' => (float) $product->weight,
                'discount_price' => $product->discount_price ? (float) $product->discount_price : null,
                'final_price' => (float) $product->final_price,
                'quantity' => $item->quantity,
                'images' => $images,
                'preview_images' => $previewImages,
            ];
        })->filter()->values();

            // Calculate totals
            $subtotal = $items->sum(function ($item) {
                return $item['final_price'] * $item['quantity'];
            });

            // Calculate discount from coupon
            $discountAmount = 0;
            $couponData = null;
            
            if ($cart->coupon_code) {
                $coupon = Coupon::findByCode($cart->coupon_code);
                if ($coupon && $coupon->isValid()) {
                    $discountAmount = $coupon->calculateDiscount($subtotal);
                    $couponData = [
                        'code' => $coupon->code,
                        'type' => $coupon->type,
                        'value' => (float) $coupon->value,
                    ];
                } else {
                    // Invalid coupon, remove it
                    $cart->coupon_code = null;
                    $cart->save();
                }
            }

            $total = max(0, $subtotal - $discountAmount);

            return response()->json([
                'success' => true,
                'items' => $items,
                'coupon_code' => $cart->coupon_code,
                'coupon' => $couponData,
                'subtotal' => round($subtotal, 2),
                'discount_amount' => round($discountAmount, 2),
                'total' => round($total, 2),
            ]);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Cart fetch error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch cart',
                'items' => [],
                'coupon_code' => null,
                'subtotal' => 0,
                'total' => 0,
                'discount_amount' => 0,
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'product_id' => 'required|integer|exists:products,id',
                'quantity' => 'nullable|integer|min:1|max:100',
            ]);

            $cart = $this->getCart($request);
            if (!$cart) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session ID required for guest users',
                ], 400);
            }

            // Verify product exists and is active
            $product = Product::where('id', $validated['product_id'])
                ->where('is_active', true)
                ->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found or not available',
                ], 404);
            }

            $quantity = $validated['quantity'] ?? 1;

            $cartItem = $cart->items()->where('product_id', $validated['product_id'])->first();

            if ($cartItem) {
                $cartItem->quantity += $quantity;
                $cartItem->save();
            } else {
                $cartItem = $cart->items()->create([
                    'product_id' => $validated['product_id'],
                    'quantity' => $quantity
                ]);
            }

            return $this->index($request);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Add to cart error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to add item to cart',
            ], 500);
        }
    }

    public function update(Request $request, $itemId)
    {
        try {
            $validated = $request->validate([
                'quantity' => 'required|integer|min:1|max:100',
            ]);

            $cart = $this->getCart($request);
            if (!$cart) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart not found',
                ], 404);
            }

            // Try to find by product_id first (frontend sends product.id)
            $cartItem = $cart->items()->where('product_id', $itemId)->first();
            
            // If not found, try by cart_item_id
            if (!$cartItem) {
                $cartItem = $cart->items()->where('id', $itemId)->first();
            }

            if (!$cartItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart item not found',
                ], 404);
            }

            $cartItem->quantity = $validated['quantity'];
            $cartItem->save();

            return $this->index($request);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Update cart error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update cart item',
            ], 500);
        }
    }

    public function destroy(Request $request, $itemId)
    {
        try {
            $cart = $this->getCart($request);
            if (!$cart) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart not found',
                ], 404);
            }

            // Try to delete by product_id first
            $deleted = $cart->items()->where('product_id', $itemId)->delete();
            
            // If not found, try by cart_item_id
            if ($deleted === 0) {
                $deleted = $cart->items()->where('id', $itemId)->delete();
            }

            if ($deleted === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart item not found',
                ], 404);
            }

            return $this->index($request);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Remove from cart error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to remove item from cart',
            ], 500);
        }
    }

    public function clear(Request $request)
    {
        try {
            $cart = $this->getCart($request);
            if ($cart) {
                $cart->items()->delete();
                $cart->coupon_code = null;
                $cart->save();
            }
            
            return $this->index($request);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Clear cart error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to clear cart',
            ], 500);
        }
    }
    
    public function applyCoupon(Request $request)
    {
        try {
            $validated = $request->validate([
                'code' => 'required|string|max:50',
            ]);
            
            $cart = $this->getCart($request);
            if (!$cart) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart not found',
                ], 404);
            }

            // Validate coupon from database
            $coupon = Coupon::findByCode($validated['code']);
            
            if (!$coupon || !$coupon->isValid()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired coupon code',
                ], 422);
            }

            // Check if cart has items
            if ($cart->items->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart is empty',
                ], 400);
            }

            $cart->coupon_code = $validated['code'];
            $cart->save();
            
            return $this->index($request);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Apply coupon error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to apply coupon',
            ], 500);
        }
    }
    
    public function removeCoupon(Request $request)
    {
        try {
            $cart = $this->getCart($request);
            if ($cart) {
                $cart->coupon_code = null;
                $cart->save();
            }
            
            return $this->index($request);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Remove coupon error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to remove coupon',
            ], 500);
        }
    }

}



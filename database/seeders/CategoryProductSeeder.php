<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategoryProductSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();

        if ($categories->isEmpty()) {
            $this->command->warn('No categories found. Please create categories first.');
            return;
        }

        // صور ذهب وفضة (روابط مضمونة من placehold.co)
        // سيتم توليد الصور ديناميكياً في الحلقة لضمان التنوع
        
        foreach ($categories as $category) {
            // الحصول على اسم القسم بشكل صحيح من قاعدة البيانات
            $categoryNameAr = $category->getTranslation('name', 'ar') ?: $category->slug;
            $categoryNameEn = $category->getTranslation('name', 'en') ?: $category->slug;
            
            // التأكد من أن الأسماء موجودة
            if (empty($categoryNameAr)) {
                $categoryNameAr = $category->slug;
            }
            if (empty($categoryNameEn)) {
                $categoryNameEn = $category->slug;
            }

            // عدد المنتجات لكل قسم (بين 3 و 10)
            $productsCount = rand(3, 10);

            $this->command->info("Creating {$productsCount} products for category: {$categoryNameAr}");

            for ($i = 1; $i <= $productsCount; $i++) {
                // اختيار عشوائي بين ذهب وفضة
                $isGold = rand(0, 1) === 1;
                $material = $isGold ? 'ذهب' : 'فضة';
                $materialEn = $isGold ? 'Gold' : 'Silver';
                
                // ألوان للخلفية والنص لتمييز الذهب والفضة
                $bgColor = $isGold ? 'FFD700' : 'C0C0C0'; // Gold or Silver
                $textColor = '000000';
                $text = urlencode("{$categoryNameEn}\n{$materialEn} Model {$i}");
                
                // رابط صورة مضمون
                $imageUrl = "https://placehold.co/800x800/{$bgColor}/{$textColor}/png?text={$text}";

                // أوزان مختلفة (بين 5 و 500 جرام)
                $weight = rand(50, 5000) / 10; // قيم مثل 5.0, 12.5, 250.0, إلخ

                // أسعار مختلفة حسب الوزن
                $basePrice = $isGold ? 150 : 50; // سعر الذهب أعلى
                $price = round($basePrice * ($weight / 10), 2);
                $discountPrice = rand(0, 1) === 1 ? round($price * (0.8 + rand(0, 15) / 100), 2) : null;

                // أسماء المنتجات متطابقة مع اسم القسم
                $productNameAr = "{$categoryNameAr} {$material} - طراز {$i}";
                $productNameEn = "{$categoryNameEn} {$materialEn} - Model {$i}";

                // أوصاف مختلفة لكل منتج
                $descriptions = [
                    'ar' => [
                        "قطعة {$material} فاخرة من {$categoryNameAr} بتصميم عصري وأنيق. الوزن: {$weight} جرام. مصنوعة يدوياً بجودة عالية.",
                        "مجوهرات {$material} راقية من مجموعة {$categoryNameAr}. تصميم فريد يجمع بين الأصالة والحداثة. الوزن: {$weight} جرام.",
                        "إكسسوار {$material} مميز من {$categoryNameAr} بتشطيبات احترافية. مثالي للاستخدام اليومي أو المناسبات الخاصة. الوزن: {$weight} جرام.",
                        "قطعة {$material} أنيقة من {$categoryNameAr} بتصميم كلاسيكي معاصر. جودة عالية وتشطيب نهائي متقن. الوزن: {$weight} جرام.",
                        "مجوهرات {$material} فاخرة من {$categoryNameAr} بتصميم مبتكر. مثالية كهدية أو للاستخدام الشخصي. الوزن: {$weight} جرام.",
                        "إكسسوار {$material} راقي من مجموعة {$categoryNameAr}. تصميم عصري يجذب الأنظار. الوزن: {$weight} جرام.",
                        "قطعة {$material} مميزة من {$categoryNameAr} بتشطيبات يدوية احترافية. جودة فائقة وتصميم أنيق. الوزن: {$weight} جرام.",
                        "مجوهرات {$material} أنيقة من {$categoryNameAr} بتصميم فريد. مثالية للمناسبات الخاصة. الوزن: {$weight} جرام.",
                    ],
                    'en' => [
                        "Luxurious {$materialEn} piece from {$categoryNameEn} with modern and elegant design. Weight: {$weight} grams. Handcrafted with high quality.",
                        "Elegant {$materialEn} jewelry from {$categoryNameEn} collection. Unique design combining authenticity and modernity. Weight: {$weight} grams.",
                        "Distinctive {$materialEn} accessory from {$categoryNameEn} with professional finishes. Perfect for daily use or special occasions. Weight: {$weight} grams.",
                        "Elegant {$materialEn} piece from {$categoryNameEn} with contemporary classic design. High quality and exquisite final finish. Weight: {$weight} grams.",
                        "Luxurious {$materialEn} jewelry from {$categoryNameEn} with innovative design. Perfect as a gift or for personal use. Weight: {$weight} grams.",
                        "Elegant {$materialEn} accessory from {$categoryNameEn} collection. Modern design that catches the eye. Weight: {$weight} grams.",
                        "Distinctive {$materialEn} piece from {$categoryNameEn} with professional handcrafted finishes. Superior quality and elegant design. Weight: {$weight} grams.",
                        "Elegant {$materialEn} jewelry from {$categoryNameEn} with unique design. Perfect for special occasions. Weight: {$weight} grams.",
                    ],
                ];

                $descriptionIndex = ($i - 1) % count($descriptions['ar']);

                $product = Product::create([
                    'category_id' => $category->id,
                    'name' => [
                        'ar' => $productNameAr,
                        'en' => $productNameEn,
                    ],
                    'description' => [
                        'ar' => $descriptions['ar'][$descriptionIndex],
                        'en' => $descriptions['en'][$descriptionIndex],
                    ],
                    'sku' => strtoupper($category->slug) . '-' . strtoupper(substr($materialEn, 0, 1)) . '-' . str_pad($category->id, 2, '0', STR_PAD_LEFT) . '-' . str_pad($i, 3, '0', STR_PAD_LEFT) . '-' . substr(uniqid('', true), -6),
                    'price' => $price,
                    'weight' => $weight,
                    'discount_price' => $discountPrice,
                    'file_format' => 'STL',
                    'file_size' => round(rand(500, 5000) / 100, 2), // بين 5 و 50 ميجابايت
                    'specifications' => [
                        'ar' => [
                            'المادة' => $material,
                            'الوزن' => "{$weight} جرام",
                            'النوع' => $categoryNameAr,
                            'التشطيب' => 'يدوي',
                        ],
                        'en' => [
                            'Material' => $materialEn,
                            'Weight' => "{$weight} grams",
                            'Type' => $categoryNameEn,
                            'Finish' => 'Handcrafted',
                        ],
                    ],
                    'is_featured' => $i <= 2, // أول منتجين مميزين
                    'is_active' => true,
                    'downloads_count' => rand(0, 100),
                    'views_count' => rand(10, 500),
                ]);

                // إضافة صور (استخدام رابط مباشر مضمون)
                try {
                    // نضيف الصورة باستخدام addMediaFromUrl
                    // هذا سيقوم بتحميل الصورة من placehold.co وتخزينها
                    $product->addMediaFromUrl($imageUrl)->toMediaCollection('images');
                } catch (\Exception $e) {
                    $this->command->warn("Could not download image for product {$product->id}: " . $e->getMessage());
                }
            }
        }

        $this->command->info('Products created successfully!');
    }
}

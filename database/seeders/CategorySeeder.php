<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => [
                    'ar' => 'خواتم',
                    'en' => 'Rings',
                ],
                'description' => [
                    'ar' => 'مجموعة واسعة من الخواتم الذهبية والفضية بتصاميم عصرية وأنيقة',
                    'en' => 'A wide range of gold and silver rings with modern and elegant designs',
                ],
                'slug' => 'rings',
                'sort_order' => 1,
            ],
            [
                'name' => [
                    'ar' => 'أقراط',
                    'en' => 'Earrings',
                ],
                'description' => [
                    'ar' => 'أقراط فاخرة من الذهب والفضة بتصاميم متنوعة',
                    'en' => 'Luxurious gold and silver earrings with various designs',
                ],
                'slug' => 'earrings',
                'sort_order' => 2,
            ],
            [
                'name' => [
                    'ar' => 'قلائد',
                    'en' => 'Necklaces',
                ],
                'description' => [
                    'ar' => 'قلائد أنيقة من الذهب والفضة للمناسبات الخاصة',
                    'en' => 'Elegant gold and silver necklaces for special occasions',
                ],
                'slug' => 'necklaces',
                'sort_order' => 3,
            ],
            [
                'name' => [
                    'ar' => 'أساور',
                    'en' => 'Bracelets',
                ],
                'description' => [
                    'ar' => 'أساور راقية من الذهب والفضة بتصاميم كلاسيكية وعصرية',
                    'en' => 'Elegant gold and silver bracelets with classic and modern designs',
                ],
                'slug' => 'bracelets',
                'sort_order' => 4,
            ],
            [
                'name' => [
                    'ar' => 'دبابيس',
                    'en' => 'Brooches',
                ],
                'description' => [
                    'ar' => 'دبابيس فاخرة من الذهب والفضة لتزيين الملابس',
                    'en' => 'Luxurious gold and silver brooches for clothing decoration',
                ],
                'slug' => 'brooches',
                'sort_order' => 5,
            ],
            [
                'name' => [
                    'ar' => 'سلاسل',
                    'en' => 'Chains',
                ],
                'description' => [
                    'ar' => 'سلاسل ذهبية وفضية بأطوال وأسماك مختلفة',
                    'en' => 'Gold and silver chains in different lengths and thicknesses',
                ],
                'slug' => 'chains',
                'sort_order' => 6,
            ],
            [
                'name' => [
                    'ar' => 'أطقم',
                    'en' => 'Sets',
                ],
                'description' => [
                    'ar' => 'أطقم مجوهرات متكاملة من الذهب والفضة',
                    'en' => 'Complete jewelry sets in gold and silver',
                ],
                'slug' => 'sets',
                'sort_order' => 7,
            ],
            [
                'name' => [
                    'ar' => 'ساعات',
                    'en' => 'Watches',
                ],
                'description' => [
                    'ar' => 'ساعات فاخرة بإطارات ذهبية وفضية',
                    'en' => 'Luxurious watches with gold and silver frames',
                ],
                'slug' => 'watches',
                'sort_order' => 8,
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::firstOrCreate(
                ['slug' => $categoryData['slug']],
                [
                    'name' => $categoryData['name'],
                    'description' => $categoryData['description'],
                    'is_active' => true,
                    'sort_order' => $categoryData['sort_order'],
                ]
            );
        }

        $this->command->info('Categories created successfully!');
    }
}

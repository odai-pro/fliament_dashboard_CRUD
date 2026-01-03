// Server-side API functions for Next.js Server Components
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/client';

export interface Category {
    id: number;
    name: string;
    description: string;
    slug: string;
    products_count: number;
    sort_order: number;
}

export interface Product {
    id: number;
    category_id: number;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    name: string;
    description: string;
    sku: string;
    price: number;
    weight: number | null;
    discount_price: number | null;
    final_price: number;
    file_format: string | null;
    file_size: number | null;
    specifications: any;
    is_featured: boolean;
    images: string[];
    preview_images: string[];
    downloads_count: number;
    views_count: number;
    created_at: string;
    updated_at: string;
}

// Server-side fetch function
async function fetchFromAPI<T>(endpoint: string, locale: 'en' | 'ar' = 'en'): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}locale=${locale}`;

    try {
        const response = await fetch(url, {
            cache: 'no-store', // Always fetch fresh data
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.data || data;
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        throw error;
    }
}

export async function getCategories(locale: 'en' | 'ar' = 'en'): Promise<Category[]> {
    return fetchFromAPI<Category[]>('/categories', locale);
}

export async function getProducts(params?: {
    category_id?: number;
    featured?: boolean;
    locale?: 'en' | 'ar';
}): Promise<Product[]> {
    const locale = params?.locale || 'en';
    let endpoint = '/products';
    const queryParams: string[] = [];

    if (params?.category_id) {
        queryParams.push(`category_id=${params.category_id}`);
    }
    if (params?.featured !== undefined) {
        queryParams.push(`featured=${params.featured}`);
    }

    if (queryParams.length > 0) {
        endpoint += '?' + queryParams.join('&');
    }

    return fetchFromAPI<Product[]>(endpoint, locale);
}

export async function getFeaturedProducts(locale: 'en' | 'ar' = 'en', limit: number = 6): Promise<Product[]> {
    const products = await getProducts({ featured: true, locale });
    return products.slice(0, limit);
}

export async function getProductById(id: number, locale: 'en' | 'ar' = 'en'): Promise<Product> {
    const result = await fetchFromAPI<{ success: boolean; data: Product }>(`/products/${id}`, locale);
    // Handle both wrapped response ({ data: ... }) and direct response depending on API consistency
    // The fetchFromAPI already handles 'data.data || data', so here we likely get the Product object directly or the wrapper.
    // Let's assume fetchFromAPI does its job.
    return result as unknown as Product;
}



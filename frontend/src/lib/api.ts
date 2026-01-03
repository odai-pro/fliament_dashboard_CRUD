import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/client';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // For CSRF cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Helper to get or create guest session ID
const getGuestSessionId = () => {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
        sessionId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
};

// Request interceptor for auth token and session ID
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Add Session ID for guest cart management
    // We always send it so backend can merge if user logs in
    const sessionId = getGuestSessionId();
    config.headers['X-Session-ID'] = sessionId;

    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            // Only redirect if not already on home to avoid loop
            if (window.location.pathname !== '/' && !window.location.pathname.includes('/login')) {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export interface LoginData {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    preferred_locale: 'en' | 'ar';
    prefers_dark_mode?: boolean;
}

export interface OTPData {
    code: string;
    user_id?: number;
    context?: 'registration' | 'login';
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    preferred_locale: 'en' | 'ar';
    prefers_dark_mode: boolean;
    layout_seed?: number;
}

export interface AuthResponse {
    user: User;
    token?: string;
    message?: string;
    requires_otp?: boolean;
}

// Auth API calls
export const authApi = {
    // Login
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post('/login', data);
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            // Also set cookie for server-side middleware
            document.cookie = `auth_token=${response.data.token}; path=/; max-age=86400; SameSite=Lax`;
        }
        return response.data;
    },

    // Register
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post('/register', data);
        return response.data;
    },

    // Verify OTP
    async verifyOTP(data: OTPData): Promise<AuthResponse> {
        const response = await api.post('/otp/verify', data);
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            // Also set cookie for server-side middleware
            document.cookie = `auth_token=${response.data.token}; path=/; max-age=86400; SameSite=Lax`;
        }
        return response.data;
    },

    // Resend OTP
    async resendOTP(data: { user_id: number; context: 'registration' | 'login' }): Promise<{ message: string }> {
        const response = await api.post('/otp/resend', data);
        return response.data;
    },

    // Logout
    async logout(): Promise<void> {
        try {
            await api.post('/logout');
        } catch (error) {
            // Ignore logout errors (e.g. 401 if already logged out)
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            // Clear cookie
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    },

    // Get current user
    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if authenticated
    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    },
};

// Product and Category interfaces
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

export interface ProductDetail extends Product {
    '3d_file': string | null;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    meta?: PaginationMeta;
    count?: number; // Backwards compatibility
}

// Products and Categories API
export const productsApi = {
    // Get all products
    async getAll(params?: {
        category_id?: number;
        featured?: boolean;
        locale?: 'en' | 'ar';
        page?: number;
        per_page?: number;
    }): Promise<PaginatedResponse<Product>> {
        const queryParams = new URLSearchParams();
        if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
        if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
        if (params?.locale) queryParams.append('locale', params.locale);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

        const response = await api.get(`/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
        return response.data;
    },

    // Get single product
    async getById(id: number, locale?: 'en' | 'ar'): Promise<{ success: boolean; data: ProductDetail }> {
        const queryParams = new URLSearchParams();
        if (locale) queryParams.append('locale', locale);

        const response = await api.get(`/products/${id}${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
        return response.data;
    },
};

export const categoriesApi = {
    // Get all categories
    async getAll(locale?: 'en' | 'ar'): Promise<{ success: boolean; data: Category[]; count: number }> {
        const queryParams = new URLSearchParams();
        if (locale) queryParams.append('locale', locale);

        const response = await api.get(`/categories${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
        return response.data;
    },

    // Get single category
    async getById(id: number, locale?: 'en' | 'ar'): Promise<{ success: boolean; data: Category }> {
        const queryParams = new URLSearchParams();
        if (locale) queryParams.append('locale', locale);

        const response = await api.get(`/categories/${id}${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
        return response.data;
    },
};

// Cart API
export const cartApi = {
    async getCart(locale?: 'en' | 'ar'): Promise<any> {
        const queryParams = new URLSearchParams();
        if (locale) queryParams.append('locale', locale);
        const response = await api.get(`/cart${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
        return response.data;
    },

    async addToCart(productId: number, quantity: number = 1, locale?: 'en' | 'ar'): Promise<any> {
        const queryParams = new URLSearchParams();
        if (locale) queryParams.append('locale', locale);
        const response = await api.post(`/cart${queryParams.toString() ? '?' + queryParams.toString() : ''}`, { product_id: productId, quantity });
        return response.data;
    },

    async updateQuantity(productId: number, quantity: number, locale?: 'en' | 'ar'): Promise<any> {
        const queryParams = new URLSearchParams();
        if (locale) queryParams.append('locale', locale);
        const response = await api.put(`/cart/${productId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`, { quantity });
        return response.data;
    },

    async removeFromCart(productId: number, locale?: 'en' | 'ar'): Promise<any> {
        const queryParams = new URLSearchParams();
        if (locale) queryParams.append('locale', locale);
        const response = await api.delete(`/cart/${productId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
        return response.data;
    },

    async clearCart(locale?: 'en' | 'ar'): Promise<any> {
        const queryParams = new URLSearchParams();
        if (locale) queryParams.append('locale', locale);
        const response = await api.delete(`/cart${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
        return response.data;
    },

    async applyCoupon(code: string, locale?: 'en' | 'ar'): Promise<any> {
        const queryParams = new URLSearchParams();
        if (locale) queryParams.append('locale', locale);
        const response = await api.post(`/cart/coupon${queryParams.toString() ? '?' + queryParams.toString() : ''}`, { code });
        return response.data;
    },

    async removeCoupon(locale?: 'en' | 'ar'): Promise<any> {
        const queryParams = new URLSearchParams();
        if (locale) queryParams.append('locale', locale);
        const response = await api.delete(`/cart/coupon${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
        return response.data;
    },
};

export interface OrderItem {
    product_id: number;
    quantity: number;
    price: number;
}

export interface OrderData {
    items: OrderItem[];
    subtotal: number;
    total: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    address: string;
    city: string;
    notes?: string;
    payment_method: 'cod'; // Only COD for now
    coupon_code?: string;
}

export const ordersApi = {
    async createOrder(data: OrderData): Promise<{ success: boolean; message: string; order_id: number }> {
        const response = await api.post('/orders', data);
        return response.data;
    }
};

export default api;

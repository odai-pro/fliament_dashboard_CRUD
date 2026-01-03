# 🔗 كيفية ربط ملفات TSX مع API

## 📍 المسارات الصحيحة

**Base URL:** `http://localhost:8000/api/client`

### ⚠️ مهم جداً:
- **لا تفتح** `/api/client` مباشرة في المتصفح - هذا يعطي 404
- المسارات الصحيحة هي: `/api/client/register`، `/api/client/login`، إلخ
- استخدم ملف `api.ts` للاتصال بالـ API من ملفات TSX

---

## 📝 كيفية الاستخدام في ملفات TSX

### 1. في صفحة Login (`login/page.tsx`):

```tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // هذا يستدعي: POST http://localhost:8000/api/client/login
            await login({
                email: "user@example.com",
                password: "password123",
                remember: true
            });
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
    
    return (
        // ... JSX
    );
}
```

### 2. في صفحة Register (`register/page.tsx`):

```tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
    const { register } = useAuth();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // هذا يستدعي: POST http://localhost:8000/api/client/register
            await register({
                name: "John Doe",
                email: "user@example.com",
                password: "password123",
                password_confirmation: "password123",
                preferred_locale: "en",
                prefers_dark_mode: false
            });
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };
    
    return (
        // ... JSX
    );
}
```

### 3. في صفحة OTP (`otp/page.tsx`):

```tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function OTPPage() {
    const { verifyOTP, resendOTP } = useAuth();
    
    const handleVerify = async (code: string) => {
        try {
            // هذا يستدعي: POST http://localhost:8000/api/client/otp/verify
            await verifyOTP({ code });
        } catch (error) {
            console.error("OTP verification failed:", error);
        }
    };
    
    const handleResend = async () => {
        try {
            // هذا يستدعي: POST http://localhost:8000/api/client/otp/resend
            await resendOTP();
        } catch (error) {
            console.error("Resend failed:", error);
        }
    };
    
    return (
        // ... JSX
    );
}
```

---

## 🔧 الملفات المهمة

### 1. `src/lib/api.ts`
هذا الملف يحتوي على جميع دوال API:
- `authApi.login()` → `POST /api/client/login`
- `authApi.register()` → `POST /api/client/register`
- `authApi.verifyOTP()` → `POST /api/client/otp/verify`
- `authApi.resendOTP()` → `POST /api/client/otp/resend`
- `authApi.logout()` → `POST /api/client/logout`
- `authApi.getCurrentUser()` → من localStorage

### 2. `src/contexts/AuthContext.tsx`
هذا الملف يوفر Context للـ Authentication:
- `useAuth()` hook للوصول إلى دوال Authentication
- `user` - بيانات المستخدم الحالي
- `isAuthenticated` - هل المستخدم مسجل دخول
- `isLoading` - حالة التحميل

---

## 🚀 الأوامر المطلوبة

### 1. تشغيل Laravel:
```powershell
cd C:\xampp\htdocs\jewelry
php artisan serve
```
سيشغل على: `http://localhost:8000`

### 2. تشغيل Next.js:
```powershell
cd C:\xampp\htdocs\jewelry\frontend
npm run dev
```
سيشغل على: `http://localhost:3001`

---

## ✅ مثال كامل: صفحة Login

```tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const router = useRouter();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            // ✅ هذا يستدعي API تلقائياً
            await login({ email, password });
            // ✅ بعد النجاح، سيتم التوجيه تلقائياً إلى /home أو /otp
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
            </button>
        </form>
    );
}
```

---

## 🔍 استكشاف الأخطاء

### إذا ظهر "Network Error" أو "CORS Error":
1. تأكد من أن Laravel يعمل: `php artisan serve`
2. تأكد من أن Next.js يعمل: `npm run dev`
3. تحقق من `config/cors.php` في Laravel

### إذا ظهر "404 Not Found":
- تأكد من أنك تستخدم الدوال من `useAuth()` وليس استدعاء API مباشرة
- المسار `/api/client` لا يوجد - استخدم `/api/client/login` أو `/api/client/register`

### إذا ظهر "401 Unauthorized":
- تأكد من إرسال token في Header (يتم تلقائياً من `api.ts`)
- تحقق من أن token صحيح وغير منتهي الصلاحية

---

## 📌 ملاحظات مهمة

1. **لا تستدعي API مباشرة** - استخدم `useAuth()` hook
2. **جميع الطلبات** تمر عبر `src/lib/api.ts`
3. **التوجيه التلقائي** يتم من `AuthContext`
4. **Token** يُحفظ تلقائياً في localStorage



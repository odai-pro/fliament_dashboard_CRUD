# 🔗 API Routes Documentation

## المسارات الصحيحة للـ API

جميع المسارات تبدأ من: `http://localhost:8000/api/client`

### 📝 Authentication Routes

#### 1. تسجيل حساب جديد
```
POST http://localhost:8000/api/client/register
Content-Type: application/json
Accept: application/json

Body:
{
  "name": "اسم المستخدم",
  "email": "email@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "preferred_locale": "en",  // أو "ar"
  "prefers_dark_mode": false
}
```

#### 2. تسجيل الدخول
```
POST http://localhost:8000/api/client/login
Content-Type: application/json
Accept: application/json

Body:
{
  "email": "email@example.com",
  "password": "password123",
  "remember": true
}
```

#### 3. التحقق من OTP
```
POST http://localhost:8000/api/client/otp/verify
Content-Type: application/json
Accept: application/json

Body:
{
  "code": "123456",
  "user_id": 1,
  "context": "registration"  // أو "login"
}
```

#### 4. إعادة إرسال OTP
```
POST http://localhost:8000/api/client/otp/resend
Content-Type: application/json
Accept: application/json

Body:
{
  "user_id": 1,
  "context": "registration"  // أو "login"
}
```

#### 5. تسجيل الخروج (يتطلب Authentication)
```
POST http://localhost:8000/api/client/logout
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

#### 6. جلب بيانات المستخدم (يتطلب Authentication)
```
GET http://localhost:8000/api/client/user
Authorization: Bearer {token}
Accept: application/json
```

### 📊 Visit Routes

#### 7. تسجيل زيارة
```
POST http://localhost:8000/api/client/visits/log
Content-Type: application/json
Accept: application/json

Body (اختياري):
{
  "landing_page": "/",
  "referrer": "https://example.com"
}
```

#### 8. إحصائيات الزيارات
```
GET http://localhost:8000/api/client/visits/stats
Accept: application/json
```

---

## 🚀 الأوامر المطلوبة لتشغيل المشروع

### 1. تشغيل Laravel Backend
```powershell
cd C:\xampp\htdocs\jewelry
php artisan serve
```
سيشغل Laravel على: `http://localhost:8000`

### 2. تشغيل Next.js Frontend
```powershell
cd C:\xampp\htdocs\jewelry\frontend
npm run dev
```
سيشغل Next.js على: `http://localhost:3001` (أو 3000 إذا كان متاحاً)

### 3. التحقق من أن Laravel يعمل
```powershell
# في PowerShell
Invoke-WebRequest -Uri "http://localhost:8000/api/client/visits/stats" -Method GET -Headers @{"Accept"="application/json"} -UseBasicParsing
```

### 4. عرض جميع Routes
```powershell
php artisan route:list --path=api/client
```

---

## ⚙️ إعدادات CORS

تم تفعيل CORS للسماح بـ:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

الملف: `config/cors.php`

---

## 🔧 استكشاف الأخطاء

### إذا ظهر "Not Found":
1. تأكد من أن Laravel يعمل: `php artisan serve`
2. تأكد من أن المسار يبدأ بـ `/api/client/`
3. تحقق من أن الـ Method صحيح (POST/GET)
4. تأكد من إرسال Headers الصحيحة

### إذا ظهر CORS Error:
1. تحقق من `config/cors.php`
2. تأكد من أن `supports_credentials` = `true`
3. أعد تشغيل Laravel

### إذا ظهر 401 Unauthorized:
1. تأكد من إرسال `Authorization: Bearer {token}` في Header
2. تحقق من أن الـ token صحيح وغير منتهي الصلاحية

---

## 📍 المسارات في Next.js

في ملف `frontend/src/lib/api.ts`:
- Base URL: `http://localhost:8000/api/client`
- جميع الطلبات تذهب تلقائياً إلى المسار الصحيح

مثال:
```typescript
// في Next.js
await authApi.login({ email: "test@test.com", password: "password123" });
// سيرسل POST إلى: http://localhost:8000/api/client/login
```



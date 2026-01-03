# 🚀 دليل تشغيل المشروع

## 📋 المتطلبات

- PHP 8.2+
- Composer
- Node.js 18+
- npm أو yarn
- XAMPP (لـ MySQL - اختياري)

---

## 🔧 خطوات التشغيل

### 1️⃣ تشغيل Laravel Backend (قواعد البيانات)

افتح **Terminal/PowerShell** الأول:

```powershell
# الانتقال إلى مجلد المشروع
cd C:\xampp\htdocs\jewelry

# تثبيت المكتبات (إذا لم تكن مثبتة)
composer install

# نسخ ملف .env (إذا لم يكن موجود)
copy .env.example .env

# إنشاء مفتاح التطبيق
php artisan key:generate

# تشغيل الـ Migrations
php artisan migrate

# تشغيل Laravel
php artisan serve
```

✅ **Laravel سيعمل على:** `http://localhost:8000`

---

### 2️⃣ تشغيل Next.js Frontend (التصميم)

افتح **Terminal/PowerShell** الثاني (نافذة جديدة):

```powershell
# الانتقال إلى مجلد Frontend
cd C:\xampp\htdocs\jewelry\frontend

# تثبيت المكتبات (إذا لم تكن مثبتة)
npm install

# تشغيل Next.js
npm run dev
```

✅ **Next.js سيعمل على:** `http://localhost:3001` (أو 3000)

---

## 🌐 الروابط بعد التشغيل

### Frontend (Next.js):
- **الصفحة الرئيسية:** http://localhost:3001
- **تسجيل الدخول:** http://localhost:3001/login
- **إنشاء حساب:** http://localhost:3001/register
- **صفحة OTP:** http://localhost:3001/otp
- **الصفحة الرئيسية (بعد تسجيل الدخول):** http://localhost:3001/home

### Backend (Laravel API):
- **API Base URL:** http://localhost:8000/api/client
- **Admin Panel (Filament):** http://localhost:8000/admin

---

## 📝 ملاحظات مهمة

### ⚠️ يجب تشغيل الاثنين معاً:
1. **Laravel** يجب أن يعمل أولاً (على المنفذ 8000)
2. **Next.js** يعمل بعد ذلك (على المنفذ 3001)

### 🔗 الربط بينهما:
- Next.js يتصل بـ Laravel عبر: `http://localhost:8000/api/client`
- الملف المسؤول: `frontend/src/lib/api.ts`

### 🗄️ قاعدة البيانات:
- الافتراضي: SQLite (`database/database.sqlite`)
- أو MySQL عبر XAMPP

---

## 🛠️ أوامر مفيدة

### Laravel:
```powershell
# عرض جميع Routes
php artisan route:list --path=api/client

# مسح الكاش
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# إنشاء مستخدم Admin
php artisan make:filament-user
```

### Next.js:
```powershell
# بناء المشروع للإنتاج
npm run build

# تشغيل النسخة المبنية
npm start

# فحص الأخطاء
npm run lint
```

---

## 🐛 حل المشاكل

### إذا ظهر "Port already in use":
```powershell
# إيقاف جميع عمليات Node.js
Stop-Process -Name node -Force

# إيقاف Laravel وإعادة تشغيله
# اضغط Ctrl+C في Terminal ثم:
php artisan serve
```

### إذا ظهر "CORS Error":
- تأكد من أن `config/cors.php` يحتوي على:
  - `'supports_credentials' => true`
  - `'allowed_origins' => ['http://localhost:3000', 'http://localhost:3001']`

### إذا ظهر "404 Not Found" في API:
- تأكد من أن Laravel يعمل على `http://localhost:8000`
- تحقق من Routes: `php artisan route:list --path=api/client`

---

## ✅ التحقق من أن كل شيء يعمل

### 1. تحقق من Laravel:
افتح المتصفح على: `http://localhost:8000/api/client/visits/stats`
يجب أن ترى: `{"total":X,"today":Y}`

### 2. تحقق من Next.js:
افتح المتصفح على: `http://localhost:3001`
يجب أن ترى صفحة الزيارة الرئيسية

### 3. جرب تسجيل حساب جديد:
- اذهب إلى: `http://localhost:3001/register`
- املأ النموذج
- يجب أن يرسل OTP إلى البريد الإلكتروني

---

## 📁 هيكل المشروع

```
jewelry/
├── app/                    # Laravel Backend
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/        # API Controllers
│   └── Models/             # Database Models
├── database/               # Migrations & Database
├── routes/
│   └── api.php             # API Routes
├── config/
│   └── cors.php            # CORS Configuration
└── frontend/               # Next.js Frontend
    └── src/
        ├── app/            # Next.js Pages
        ├── components/     # React Components
        ├── contexts/        # React Contexts
        └── lib/
            └── api.ts      # API Connection
```

---

## 🎯 الخطوات السريعة (Quick Start)

### في Terminal الأول:
```powershell
cd C:\xampp\htdocs\jewelry
php artisan serve
```

### في Terminal الثاني:
```powershell
cd C:\xampp\htdocs\jewelry\frontend
npm run dev
```

### افتح المتصفح:
- **Next.js:** http://localhost:3001
- **Laravel API:** http://localhost:8000/api/client/visits/stats

---

## 📞 المساعدة

إذا واجهت أي مشكلة:
1. تأكد من أن كلا الخادمين يعملان
2. تحقق من Console في المتصفح (F12)
3. تحقق من Laravel Logs: `storage/logs/laravel.log`
4. تحقق من Next.js Terminal للأخطاء



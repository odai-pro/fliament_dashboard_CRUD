@echo off
echo ========================================
echo   تشغيل مشروع Jewelry
echo ========================================
echo.

echo [1/2] تشغيل Laravel Backend...
start "Laravel Backend" cmd /k "cd /d C:\xampp\htdocs\jewelry && php artisan serve"
timeout /t 3 /nobreak >nul

echo [2/2] تشغيل Next.js Frontend...
start "Next.js Frontend" cmd /k "cd /d C:\xampp\htdocs\jewelry\frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   ✅ تم تشغيل الخوادم!
echo ========================================
echo.
echo 🌐 الروابط:
echo    Next.js:    http://localhost:3000
echo    Laravel API: http://localhost:8000/api/client
echo    Admin Panel: http://localhost:8000/admin
echo.
echo اضغط أي مفتاح لإغلاق هذه النافذة...
pause >nul



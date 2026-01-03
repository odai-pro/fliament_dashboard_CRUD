"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/components/LanguageProvider";
import { ordersApi } from "@/lib/api";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useToast, ToastContainer } from "@/components/ui/Toast";

export default function CheckoutPage() {
    const { items, cartTotal, cartSubtotal, discountAmount, clearCart, coupon } = useCart();
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const { language } = useLanguage();
    const { toasts, success, error, removeToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.name || "",
        email: user?.email || "",
        phone: "",
        city: "",
        address: "",
        notes: ""
    });

    useEffect(() => {
        if (!isAuthenticated && !loading) {
            router.push('/login?redirect=/checkout');
        }
        if (items.length === 0 && !loading) {
            router.push('/home'); // Redirect if cart empty
        }
    }, [isAuthenticated, items.length, router, loading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                items: items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.final_price
                })),
                subtotal: cartSubtotal,
                total: cartTotal,
                customer_name: formData.fullName,
                customer_email: formData.email,
                customer_phone: "0000000000", // Not needed for digital
                address: "Digital Order", // Not needed for digital
                city: "Digital Order", // Not needed for digital
                notes: "Digital Download",
                payment_method: 'cod' as const,
                coupon_code: coupon?.code
            };

            const response = await ordersApi.createOrder(orderData);

            clearCart();
            
            // Show success message
            success(
                language === 'ar' 
                    ? `تم استلام طلبك بنجاح! رقم الطلب: ${response.order_number || response.order_id}`
                    : `Order placed successfully! Order #: ${response.order_number || response.order_id}`,
                5000
            );

            // Redirect after a short delay
            setTimeout(() => {
                router.push('/home');
            }, 2000);

        } catch (err: any) {
            console.error("Order failed:", err);
            
            const errorMessage = err.response?.data?.message 
                || (language === 'ar' ? 'حدث خطأ أثناء إتمام الطلب' : 'Failed to place order');
            
            error(errorMessage, 6000);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated || items.length === 0) return null;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <Navbar />

            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold font-serif mb-8 text-center">
                    {language === 'ar' ? 'إتمام الطلب' : 'Checkout'}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Form */}
                    <ScrollReveal className="space-y-8">
                        <form onSubmit={handleSubmit} className="bg-[var(--bg-secondary)] p-8 rounded-[2rem] border border-[var(--border-color)] space-y-6">
                            <h2 className="text-xl font-bold mb-4">{language === 'ar' ? 'معلوماتك' : 'Your Information'}</h2>
                            <p className="text-sm text-[var(--text-secondary)] mb-6">
                                {language === 'ar'
                                    ? 'يرجى إدخال بريدك الإلكتروني بشكل صحيح حيث سيتم إرسال رابط التحميل إليه.'
                                    : 'Please ensure your email is correct. The download link will be sent to this address.'}
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-[var(--text-secondary)] mb-2">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-[var(--gold-primary)] outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-[var(--text-secondary)] mb-2">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 focus:border-[var(--gold-primary)] outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </form>
                    </ScrollReveal>

                    {/* Right: Order Summary */}
                    <ScrollReveal delay={0.2} className="space-y-6">
                        <div className="bg-[var(--bg-secondary)] p-8 rounded-[2rem] border border-[var(--border-color)]">
                            <h2 className="text-xl font-bold mb-6">{language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h2>

                            <div className="space-y-4 max-h-80 overflow-y-auto mb-6 pr-2">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.images?.[0] || item.preview_images?.[0] || 'https://placehold.co/100x100'} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm line-clamp-2">{item.name}</h3>
                                            <p className="text-sm text-[var(--text-secondary)]">{item.quantity} x ${item.final_price.toFixed(2)}</p>
                                        </div>
                                        <div className="font-bold">
                                            ${(item.final_price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[var(--border-color)] pt-4 space-y-3">
                                <div className="flex justify-between text-[var(--text-secondary)]">
                                    <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                    <span>${cartSubtotal.toFixed(2)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-500">
                                        <span>{language === 'ar' ? 'الخصم' : 'Discount'}</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-xl text-[var(--text-primary)] pt-2 border-t border-[var(--border-color)] mt-2">
                                    <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-secondary)] text-black font-bold text-lg rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--gold-primary)]/20 disabled:opacity-50"
                                >
                                    {loading
                                        ? (language === 'ar' ? 'جاري المعالجة...' : 'Processing...')
                                        : (language === 'ar' ? 'تأكيد الطلب' : 'Place Order')
                                    }
                                </button>
                                <p className="text-center text-xs text-[var(--text-secondary)] mt-4">
                                    {language === 'ar' ? 'سيتم إرسال الملفات عبر البريد الإلكتروني' : 'Files will be sent via email'}
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </main>
            <Footer />
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
}

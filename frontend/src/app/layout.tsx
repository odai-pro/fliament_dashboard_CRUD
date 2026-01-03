import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { AddToCartAnimation } from "@/components/ui/AddToCartAnimation";
import { CartDrawer } from "@/components/CartDrawer";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AUVÉA Jewelry Designs",
  description: "Immersive 3D fine-jewelry atelier",
};

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  weight: ["300", "400", "600", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value || "en";
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <html lang={language} dir={dir} className={`${cairo.variable}`}>
      <body className="antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                {children}
                <AddToCartAnimation />
                <CartDrawer />
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Script
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
          type="module"
          strategy="lazyOnload"
        />
        <LoadingScreen />
      </body>
    </html>
  );
}

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HeroSlider } from "@/components/hero/HeroSlider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getFeaturedProducts, getCategories } from "@/lib/server-api";
import { ProductsShowcase } from "@/components/ProductsShowcase";
import { VisitPageClient } from "@/components/VisitPageClient";
import { cookies } from "next/headers";

async function getInitialData(locale: 'en' | 'ar' = 'en') {
  try {
    const [featuredProducts, categories] = await Promise.all([
      getFeaturedProducts(locale, 6),
      getCategories(locale),
    ]);
    return { featuredProducts, categories };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return { featuredProducts: [], categories: [] };
  }
}

export default async function VisitPage() {
  // Get language from cookies or default to 'en'
  const cookieStore = await cookies();
  const language = (cookieStore.get('language')?.value || 'en') as 'en' | 'ar';

  // Fetch data on server - no loading state needed!
  const { featuredProducts, categories } = await getInitialData(language);


  return (
    <VisitPageClient
      featuredProducts={featuredProducts}
      categories={categories}
      language={language}
    />
  );
}

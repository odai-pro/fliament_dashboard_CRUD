import { getProductById } from "@/lib/server-api";
import { ProductDetailsClient } from "@/components/products/ProductDetailsClient";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

// Force dynamic rendering since we depend on cookies (locale)
export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Get language from cookies
    const cookieStore = await cookies();
    const language = (cookieStore.get('language')?.value || 'en') as 'en' | 'ar';

    let product;

    try {
        product = await getProductById(parseInt(id), language);
    } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
    }

    if (!product) {
        notFound();
    }

    return <ProductDetailsClient product={product} language={language} />;
}

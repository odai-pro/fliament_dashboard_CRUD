import { CategoryClient } from "@/components/CategoryClient";
import { Metadata, ResolvingMetadata } from "next";
import { getCategories } from "@/lib/server-api";
import { categoriesApi } from "@/lib/api";

type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Generate dynamic metadata for SEO
export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // Read route params - params is a Promise in Next.js 15+
    const { id } = await params;
    
    // Fetch data (using fetch directly or a helper)
    // Note: We need to handle potential errors if category not found
    try {
        // Using a direct fetch here to avoid client-side dependencies in server logic
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/client'}/categories/${id}`);
        const data = await response.json();
        
        if (!data.success) {
            return {
                title: 'Category Not Found | AUVÉA',
            };
        }

        const category = data.data;
        
        return {
            title: `${category.name} | AUVÉA Jewelry`,
            description: category.description || `Explore our exclusive collection of ${category.name}. Handcrafted luxury jewelry designed for elegance.`,
            openGraph: {
                title: `${category.name} | AUVÉA Jewelry`,
                description: category.description,
                // images: ['/some-specific-image-url.jpg'], // Add if category has an image
            },
        };
    } catch (e) {
        return {
            title: 'AUVÉA Jewelry',
            description: 'Luxury 3D Jewelry Atelier',
        };
    }
}

export default function Page() {
    return <CategoryClient />;
}

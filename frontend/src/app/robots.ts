import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://auvea-jewelry.com'; // Replace with actual domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Disallow admin panel
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}



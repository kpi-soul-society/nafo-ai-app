import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow:
        process.env.NEXT_PUBLIC_STAGE === 'prod' ? ['/editor/', '/auth/', '/api/', '/checkout/', '/example/'] : '/',
    },

    sitemap: process.env.NEXT_PUBLIC_STAGE === 'prod' ? 'https://nafoai.com/sitemap.xml' : undefined,
  };
}

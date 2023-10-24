import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return process.env.NEXT_PUBLIC_STAGE === 'prod'
    ? [
        {
          url: 'https://nafoai.com',
          lastModified: new Date(),
          priority: 1,
        },
        {
          url: 'https://nafoai.com/gallery',
          lastModified: new Date(),
          priority: 0.9,
        },
        {
          url: 'https://nafoai.com/tokens',
          lastModified: new Date(),
          priority: 0.8,
        },
      ]
    : [];
}

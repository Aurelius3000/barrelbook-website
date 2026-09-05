import type { MetadataRoute } from 'next'
import { KBF_UPDATED_AT, KBF_URL, releases, releasePath } from '@/lib/kbf-releases'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: KBF_URL,
      lastModified: new Date(KBF_UPDATED_AT),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...releases.map((release) => ({
      url: `https://www.barrelbook.app${releasePath(release)}`,
      lastModified: new Date(KBF_UPDATED_AT),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    })),
    {
      url: 'https://www.barrelbook.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.barrelbook.app/privacy',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://www.barrelbook.app/android',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://www.barrelbook.app/scan',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.barrelbook.app/collection',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.barrelbook.app/store-picks',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.barrelbook.app/terms',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}

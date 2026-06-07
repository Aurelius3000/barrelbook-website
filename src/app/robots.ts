import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/p/',
        '/qa/',
        // Plan Task 4: approval assets are direct-link only, not public discovery.
        '/openai-approval/',
        '/blackshirt',
        '/thebourbontrail',
        '/fnf',
        '/garys',
        '/garyspro',
        '/garysplus',
        '/fobu0307',
      ],
    },
    sitemap: 'https://www.barrelbook.app/sitemap.xml',
  }
}

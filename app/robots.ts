import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/*/social-callback/', '/api/', '/_next/', '/static/', '/404', '/500', '/*.json$'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/llms.txt',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/llms.txt',
        disallow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/*/social-callback/', '/api/', '/_next/', '/static/', '/404', '/500', '/*.json$'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/*/social-callback/', '/api/', '/_next/', '/static/', '/404', '/500', '/*.json$'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}

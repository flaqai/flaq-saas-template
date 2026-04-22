import type { Organization, WebSite, WithContext } from 'schema-dts';

export default function JsonLdScript() {
  const organizationJsonLd: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: process.env.JSON_LD_NAME,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`,
    description: process.env.JSON_LD_DESCRIPTION,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: process.env.JSON_LD_EMAIL,
        contactType: 'Technical support',
      },
    ],
    sameAs: [process.env.JSON_LD_TWITTER_LINK as string, process.env.JSON_LD_LINKEDID_LINK as string],
    aggregateRating: {
      name: process.env.JSON_LD_NAME,
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '53253',
      bestRating: '5',
      worstRating: '1',
    },
  };

  const websiteJsonLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: process.env.JSON_LD_NAME,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    description: process.env.JSON_LD_DESCRIPTION,
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/images/home/home-page.jpg`,
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: process.env.JSON_LD_NAME,
      logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`,
    },
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify([websiteJsonLd, organizationJsonLd]) }}
    />
  );
}

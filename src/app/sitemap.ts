// src/app/sitemap.ts
import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nhatcapdang.com';

// Helper that returns alternates for en (no prefix) and vi (with prefix)
const withAlternates = (path: string): MetadataRoute.Sitemap[0] => ({
  url: `${SITE_URL}${path}`, // default locale 'en' uses as-needed (no prefix)
  changeFrequency: 'weekly',
  priority: 0.7,
  alternates: {
    languages: {
      en: `${SITE_URL}${path}`,
      vi: `${SITE_URL}/vi${path === '/' ? '' : path}`,
    },
  },
  lastModified: new Date(),
});

export default function sitemap(): MetadataRoute.Sitemap {
  // Add the key public routes you want indexed
  const routes = [
    '/', // home
    '/explore', // explore page
    // Add more static routes here (/faq, /contact, etc.)
  ].map(withAlternates);

  // If you want to include dynamic content (e.g., campaigns), fetch and map here:
  // const campaigns = getCampaignsSomehow();
  // const campaignRoutes = campaigns.map(c => withAlternates(`/campaigns/${c.slug}`));

  return [
    ...routes,
    // ...campaignRoutes,
  ];
}

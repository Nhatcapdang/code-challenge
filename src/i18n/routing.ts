import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'vi'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Remove locale prefix from URLs when it matches default locale
  localePrefix: 'as-needed',

  // Optional: detect locale from Accept-Language header
  localeDetection: true,
});

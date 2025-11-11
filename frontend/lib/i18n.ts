export const locales = ['en', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function getDictionary(locale: Locale) {
  return import(`../public/locales/${locale}/common.json`).then((module) => module.default);
}

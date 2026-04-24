export const defaultLocale = 'en';

export const languages = [
  {
    code: 'en-US',
    lang: 'en',
    backendValue: 'en',
    label: 'English',
  },
  {
    code: 'zh-CN',
    lang: 'zh',
    backendValue: 'zh',
    label: '简体中文',
    englishLabel: 'Simplified Chinese',
  },
];

export const generateLanguagePaths = (baseRoute: string, route: string) =>
  languages.reduce(
    (paths, { code, lang }) => ({
      ...paths,
      [lang === defaultLocale ? 'x-default' : code]:
        lang === defaultLocale ? `${baseRoute}/${route}` : `${baseRoute}/${lang}/${route}`,
    }),
    {},
  );

export const getLanguagePaths = () =>
  languages.map(({ lang }) => (lang === defaultLocale ? '/' : `/${lang}/`));

export const locales = languages.map((lang) => lang.lang);

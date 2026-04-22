import { use } from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { generateLanguagePaths } from '@/i18n/languages';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, getMessages } from 'next-intl/server';

import { Toaster } from '@/components/ui/sonner';

import './globals.css';

import { NavigationGuardProvider } from 'next-navigation-guard';
import JsonLdScript from '@/components/scripts/JsonLdScript';

import LazyGlobalUI from './LazyGlobalUI';

const din = localFont({
  src: [
    {
      path: '../../public/fonts/DIN-Medium.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-din',
});

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({
    locale,
    namespace: 'Metadata.home',
  });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
    alternates: {
      languages: {
        'x-default': './',
        ...generateLanguagePaths('', ''),
      },
      canonical: './',
    },
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('openGraph.title'),
      description: t('openGraph.description'),
      url: process.env.NEXT_PUBLIC_SITE_URL,
      siteName: t('openGraph.siteName'),
      type: 'website',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/home/home-page.jpg`,
          secureUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/images/home/home-page.jpg`,
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      title: t('twitter.title'),
      description: t('twitter.description'),
      site: t('twitter.site'),
      creator: t('twitter.creator'),
      card: 'summary_large_image',
      images: {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/home/home-page.jpg`,
        alt: t('title'),
      },
    },
  };
}

export default async function RootLayout(props: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className='dark'>
      <head>
        <JsonLdScript />
      </head>
      <body className={`${din.variable} relative mx-auto flex min-h-screen flex-col bg-black text-white`}>
        <NavigationGuardProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Toaster
              duration={2000}
              icons={{
                success: <span className='sr-only'>icon</span>,
                error: <span className='sr-only'>icon</span>,
              }}
              position='top-center'
              toastOptions={{
                classNames: {
                  success: 'text-color-green border-color-green',
                  error: 'text-color-red border-color-red',
                },
              }}
            />
            <LazyGlobalUI />
            {children}
          </NextIntlClientProvider>
        </NavigationGuardProvider>
      </body>
    </html>
  );
}

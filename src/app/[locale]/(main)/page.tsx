import Problem1 from '@/components/problem1';
import Problem3 from '@/components/problem3';
import { SwapComponent } from '@/components/swap';
import { SwapStoreProvider } from '@/providers/swap-store-provider';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const title = t('hero.titleHighlight')
    ? `${t('hero.titlePrefix')} ${t('hero.titleHighlight')} ${t(
        'hero.titleSuffix'
      )}`
    : 'Home';

  return {
    title,
    description: t('hero.description') || 'Welcome to our platform',
    alternates: {
      canonical: '/',
      languages: {
        en: '/',
        vi: '/vi',
      },
    },
  };
};

export default function Home() {
  return (
    <>
      <SwapStoreProvider>
        <SwapComponent />
      </SwapStoreProvider>
      <Problem3 />
      <Problem1 />
    </>
  );
}

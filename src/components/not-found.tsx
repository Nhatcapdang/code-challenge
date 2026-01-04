'use client';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const NotFound = () => {
  const router = useRouter();
  const t = useTranslations('not_found_page');
  return (
    <div className=" flex items-center justify-center p-4 h-screen text-center ">
      <div className="text-center  ">
        <div className="relative">
          <h1 className="text-[12rem] md:text-[16rem] font-bold leading-none select-none inline-block bg-gradient-to-r from-white/5 to-white/20 bg-clip-text text-transparent [background-image:linear-gradient(7deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.2)_100%)]">
            404
          </h1>
          <h2 className="font-medium text-gray-300 absolute bottom-5 left-0 w-full text-5xl">
            {t('title')}
          </h2>
        </div>

        <p className="text-gray-400 text-sm md:text-base max-w-sm mx-auto mb-4">
          {t('title_suffix')}
        </p>

        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-loading-purple to-loading-pink rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {t('back_to_home')}
        </button>
      </div>
    </div>
  );
};

export default NotFound;

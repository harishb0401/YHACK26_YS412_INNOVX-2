import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useTranslation } from '../i18n';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 text-[#203128]">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-[32px] border border-[#3F7655]/20 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-[#DDEBD8] text-[#244936] flex items-center justify-center mx-auto text-3xl font-black shadow-inner">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">{t('pageNotFound')}</h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            {t('pageNotFoundSub')}
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs shadow-md transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('returnToHome')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

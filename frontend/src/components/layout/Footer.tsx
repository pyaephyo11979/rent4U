import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">{t('footer.about')}</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">{t('footer.privacy')}</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

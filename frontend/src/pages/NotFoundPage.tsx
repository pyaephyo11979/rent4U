import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-6xl font-bold text-gray-200">{t('notFound.code')}</h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">{t('notFound.title')}</h2>
        <p className="mt-2 text-muted max-w-md">
          {t('notFound.message')}
        </p>
        <Link to="/" className="mt-8">
          <Button>{t('notFound.goHome')}</Button>
        </Link>
      </div>
    </Layout>
  );
}

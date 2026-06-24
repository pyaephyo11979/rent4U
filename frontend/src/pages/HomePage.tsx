import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from '../components/layout/Layout';
import { HouseGrid } from '../features/house/HouseGrid';
import { useHouses } from '../hooks/useHouses';
import { Button } from '../components/ui/Button';

export function HomePage() {
  const { t } = useTranslation();
  const { houses, loading, error, refetch } = useHouses({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' });

  return (
    <Layout>
      <section className="relative bg-gradient-to-br from-primary to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 py-20 md:py-28">
          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl leading-tight">
            {t('home.heroTitle')}
          </h1>
          <p className="mt-4 text-lg text-blue-100 max-w-xl">
            {t('home.heroDescription')}
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/search">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                {t('home.browseHomes')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{t('home.featuredListings')}</h2>
          <Link to="/search" className="text-sm font-medium text-primary hover:text-primary-hover">
            {t('home.viewAll')} &rarr;
          </Link>
        </div>
        <HouseGrid houses={houses} loading={loading} error={error} onRetry={refetch} />
      </section>
    </Layout>
  );
}

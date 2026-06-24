import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from '../components/layout/Layout';
import { HouseDetail } from '../features/house/HouseDetail';
import { BookingForm } from '../features/booking/BookingForm';
import { houseApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export function HouseDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    houseApi.get(Number(id))
      .then(({ data }) => setHouse(data.data))
      .catch(() => setError('House not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="px-4 md:px-8 lg:px-16 py-8">
          <HouseDetail house={{} as House} loading />
        </div>
      </Layout>
    );
  }

  if (error || !house) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('houseDetail.notFound')}</h1>
          <p className="text-muted mb-6">{t('houseDetail.notFoundMessage')}</p>
          <button
            onClick={() => navigate('/search')}
            className="text-primary hover:text-primary-hover font-medium"
          >
            {t('houseDetail.browseAll')} &rarr;
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 md:px-8 lg:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <HouseDetail house={house} />
          </div>
          <div>
            {user && house.isAvailable && (
              <BookingForm
                house={house}
                onSuccess={() => {
                  setHouse((prev) => prev ? { ...prev, isAvailable: false } : prev);
                }}
              />
            )}
            {!user && house.isAvailable && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                <p className="text-muted mb-4">{t('houseDetail.loginToBook')}</p>
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary hover:text-primary-hover font-medium"
                >
                  {t('houseDetail.loginLink')} &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

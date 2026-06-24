import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '../components/layout/Layout';
import { HouseGrid } from '../features/house/HouseGrid';
import { BookingCard } from '../features/booking/BookingCard';
import { HouseForm } from '../components/forms/HouseForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { houseApi, paymentApi } from '../services/api';

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isHost = user?.role.name === 'Host' || user?.role.name === 'Admin';

  const [myHouses, setMyHouses] = useState<House[]>([]);
  const [myPayments, setMyPayments] = useState<Payment[]>([]);
  const [loadingHouses, setLoadingHouses] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHouses = useCallback(async () => {
    if (!isHost) return;
    setLoadingHouses(true);
    try {
      const { data } = await houseApi.list({ limit: 100 });
      const owned = data.data.filter((h) => h.ownerId === user?.id);
      setMyHouses(owned);
    } catch {
      setError(t('dashboard.failedLoadListings'));
    } finally {
      setLoadingHouses(false);
    }
  }, [isHost, user?.id, t]);

  const fetchPayments = useCallback(async () => {
    setLoadingPayments(true);
    try {
      const { data } = await paymentApi.my();
      setMyPayments(data.data);
    } catch {
      setError(t('dashboard.failedLoadBookings'));
    } finally {
      setLoadingPayments(false);
    }
  }, [t]);

  useEffect(() => {
    fetchHouses();
    fetchPayments();
  }, [fetchHouses, fetchPayments]);

  return (
    <Layout>
      <div className="px-4 md:px-8 lg:px-16 py-8 space-y-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.welcome', { name: user?.name })}</h1>
          <p className="text-muted mt-1">{isHost ? t('dashboard.manageBookingsAndListings') : t('dashboard.manageBookings')}</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {isHost && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.myListings')}</h2>
              <Button onClick={() => setShowCreateModal(true)}>
                {t('dashboard.newListing')}
              </Button>
            </div>
            <HouseGrid
              houses={myHouses}
              loading={loadingHouses}
              error={null}
              onRetry={fetchHouses}
            />
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('dashboard.myBookings')}</h2>
          {loadingPayments ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 animate-pulse space-y-3">
                  <div className="h-5 w-2/3 bg-gray-200 rounded" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : myPayments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted">{t('dashboard.noBookings')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myPayments.map((payment) => (
                <BookingCard key={payment.id} payment={payment} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} className="max-w-2xl">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('dashboard.createNewListing')}</h2>
          <HouseForm
            onSuccess={() => {
              setShowCreateModal(false);
              fetchHouses();
            }}
          />
        </div>
      </Modal>
    </Layout>
  );
}

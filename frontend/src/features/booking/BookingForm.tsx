import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { paymentApi } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../lib/utils';

interface BookingFormProps {
  house: House;
  onSuccess?: (payment: Payment) => void;
}

export function BookingForm({ house, onSuccess }: BookingFormProps) {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await paymentApi.create({
        houseId: house.id,
        amount: house.price,
        currency: 'MMK',
      });

      const { data: verified } = await paymentApi.verify(data.data.id);
      onSuccess?.(verified.data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        t('booking.error');
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6" data-testid="booking-form">
      <h3 className="text-lg font-semibold text-gray-900">{t('booking.bookThisPlace')}</h3>

      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-gray-900">{formatPrice(house.price)}</span>
        <span className="text-muted text-sm">{t('common.perNight')}</span>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full"
        disabled={!house.isAvailable}
      >
        {house.isAvailable ? t('booking.bookNow') : t('booking.notAvailable')}
      </Button>

      <p className="text-xs text-muted text-center">
        {t('booking.disclaimer')}
      </p>
    </form>
  );
}

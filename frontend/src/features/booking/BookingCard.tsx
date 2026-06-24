import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../lib/utils';

interface BookingCardProps {
  payment: Payment;
}

const statusStyles: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export function BookingCard({ payment }: BookingCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4" data-testid="booking-card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{payment.house.name}</h3>
          <p className="text-sm text-muted">{payment.house.city}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[payment.status]}`}>
          {t(`booking.${payment.status}`)}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-gray-600">{formatPrice(payment.amount)} {payment.currency}</span>
        <span className="text-muted">{new Date(payment.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

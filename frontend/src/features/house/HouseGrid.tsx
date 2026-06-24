import { useTranslation } from 'react-i18next';
import { HouseCard } from './HouseCard';
import { Skeleton } from '../../components/ui/Skeleton';

interface HouseGridProps {
  houses: House[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function HouseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-danger mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium text-primary hover:text-primary-hover underline"
        >
          {t('common.tryAgain')}
        </button>
      )}
    </div>
  );
}

export function HouseGrid({ houses, loading, error, onRetry }: HouseGridProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <HouseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (houses.length === 0) return <EmptyState message={t('houseGrid.noHousesFound')} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {houses.map((house) => (
        <HouseCard key={house.id} house={house} />
      ))}
    </div>
  );
}

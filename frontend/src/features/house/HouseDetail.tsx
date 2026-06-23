import { formatPrice } from '../../lib/utils';
import { Skeleton } from '../../components/ui/Skeleton';

interface HouseDetailProps {
  house: House;
  loading?: boolean;
}

export function HouseDetail({ house, loading }: HouseDetailProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const mainImage = house.images[0]?.url ?? '/placeholder-house.jpg';

  return (
    <div className="space-y-6" data-testid="house-detail">
      <div className="rounded-2xl overflow-hidden">
        {house.images.length > 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <img
              src={house.images[0].url}
              alt={house.name}
              className="w-full h-96 object-cover md:col-span-2"
            />
            {house.images.slice(1, 5).map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt={house.name}
                className="w-full h-48 object-cover"
              />
            ))}
          </div>
        ) : (
          <img src={mainImage} alt={house.name} className="w-full h-96 object-cover" />
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{house.name}</h1>
        <p className="text-muted mt-1">{house.city}, {house.address}</p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <span className="rounded-full bg-gray-100 px-3 py-1">{house.rooms} {house.rooms === 1 ? 'room' : 'rooms'}</span>
        <span className="rounded-full bg-gray-100 px-3 py-1">{house.bathrooms} {house.bathrooms === 1 ? 'bathroom' : 'bathrooms'}</span>
        <span className={`rounded-full px-3 py-1 ${house.isAvailable ? 'bg-green-100 text-secondary' : 'bg-red-100 text-danger'}`}>
          {house.isAvailable ? 'Available' : 'Rented'}
        </span>
      </div>

      <div>
        <p className="text-2xl font-bold text-gray-900">
          {formatPrice(house.price)} <span className="text-base font-normal text-muted">/ night</span>
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">About this place</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{house.description}</p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-muted">
          Hosted by <span className="font-medium text-gray-900">{house.owner.name}</span>
        </p>
        <p className="text-sm text-muted mt-1">
          Available from {new Date(house.dateAvailable).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

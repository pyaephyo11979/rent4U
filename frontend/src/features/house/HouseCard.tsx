import { Link } from 'react-router-dom';
import { formatPrice } from '../../lib/utils';
import { Card, CardImage, CardBody } from '../../components/ui/Card';

interface HouseCardProps {
  house: House;
}

export function HouseCard({ house }: HouseCardProps) {
  const imageUrl = house.images[0]?.url ?? '/placeholder-house.jpg';

  return (
    <Link to={`/houses/${house.id}`} data-testid="house-card">
      <Card className="transition-shadow hover:shadow-card-hover">
        <CardImage src={imageUrl} alt={house.name} />
        <CardBody>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{house.name}</h3>
              <p className="text-muted text-sm">{house.city}</p>
            </div>
            {!house.isAvailable && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-danger">
                Rented
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="font-bold text-gray-900">
              {formatPrice(house.price)} <span className="text-sm font-normal text-muted">/ night</span>
            </p>
            <p className="text-sm text-muted">
              {house.rooms} {house.rooms === 1 ? 'room' : 'rooms'}
            </p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

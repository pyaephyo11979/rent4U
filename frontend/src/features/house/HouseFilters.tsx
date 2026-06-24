import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface HouseFiltersProps {
  onFilter: (params: HouseSearchParams) => void;
  initial?: HouseSearchParams;
}

export function HouseFilters({ onFilter, initial }: HouseFiltersProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(initial?.search ?? '');
  const [city, setCity] = useState(initial?.city ?? '');
  const [minPrice, setMinPrice] = useState(initial?.minPrice?.toString() ?? '');
  const [maxPrice, setMaxPrice] = useState(initial?.maxPrice?.toString() ?? '');
  const [rooms, setRooms] = useState(initial?.rooms?.toString() ?? '');
  const [sortBy, setSortBy] = useState<HouseSearchParams['sortBy']>(initial?.sortBy ?? 'createdAt');
  const [sortOrder, setSortOrder] = useState<HouseSearchParams['sortOrder']>(initial?.sortOrder ?? 'desc');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onFilter({
      search: search || undefined,
      city: city || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      rooms: rooms ? Number(rooms) : undefined,
      sortBy,
      sortOrder,
      page: 1,
    });
  }

  function handleReset() {
    setSearch('');
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setRooms('');
    setSortBy('createdAt');
    setSortOrder('desc');
    onFilter({ page: 1 });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8" data-testid="house-filters">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label={t('filters.search')}
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('filters.searchPlaceholder')}
        />
        <Input
          label={t('filters.city')}
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t('filters.cityPlaceholder')}
        />
        <Input
          label={t('filters.minPrice')}
          type="number"
          name="minPrice"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder={t('filters.minPricePlaceholder')}
          min={0}
        />
        <Input
          label={t('filters.maxPrice')}
          type="number"
          name="maxPrice"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder={t('filters.maxPricePlaceholder')}
          min={0}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label={t('filters.rooms')}
          type="number"
          name="rooms"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          placeholder={t('filters.maxPricePlaceholder')}
          min={1}
        />
        <div className="space-y-1">
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">{t('filters.sortBy')}</label>
          <select
            id="sortBy"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as HouseSearchParams['sortBy'])}
          >
            <option value="createdAt">{t('filters.newest')}</option>
            <option value="price">{t('filters.price')}</option>
            <option value="rooms">{t('filters.rooms')}</option>
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">{t('filters.order')}</label>
          <select
            id="sortOrder"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as HouseSearchParams['sortOrder'])}
          >
            <option value="desc">{t('filters.descending')}</option>
            <option value="asc">{t('filters.ascending')}</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="md">{t('filters.applyFilters')}</Button>
        <Button type="button" variant="ghost" size="md" onClick={handleReset}>{t('filters.reset')}</Button>
      </div>
    </form>
  );
}

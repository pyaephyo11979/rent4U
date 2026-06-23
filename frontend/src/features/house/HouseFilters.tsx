import { useState, type FormEvent } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface HouseFiltersProps {
  onFilter: (params: HouseSearchParams) => void;
  initial?: HouseSearchParams;
}

export function HouseFilters({ onFilter, initial }: HouseFiltersProps) {
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
          label="Search"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Name, description, city..."
        />
        <Input
          label="City"
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Any city"
        />
        <Input
          label="Min Price"
          type="number"
          name="minPrice"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="0"
          min={0}
        />
        <Input
          label="Max Price"
          type="number"
          name="maxPrice"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Any"
          min={0}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Rooms"
          type="number"
          name="rooms"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          placeholder="Any"
          min={1}
        />
        <div className="space-y-1">
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort by</label>
          <select
            id="sortBy"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as HouseSearchParams['sortBy'])}
          >
            <option value="createdAt">Newest</option>
            <option value="price">Price</option>
            <option value="rooms">Rooms</option>
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">Order</label>
          <select
            id="sortOrder"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as HouseSearchParams['sortOrder'])}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="md">Apply Filters</Button>
        <Button type="button" variant="ghost" size="md" onClick={handleReset}>Reset</Button>
      </div>
    </form>
  );
}

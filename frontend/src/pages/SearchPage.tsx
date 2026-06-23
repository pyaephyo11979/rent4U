import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { HouseGrid } from '../features/house/HouseGrid';
import { HouseFilters } from '../features/house/HouseFilters';
import { useHouses } from '../hooks/useHouses';
import { Button } from '../components/ui/Button';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialParams: HouseSearchParams = {
    search: searchParams.get('search') || undefined,
    city: searchParams.get('city') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    rooms: searchParams.get('rooms') ? Number(searchParams.get('rooms')) : undefined,
    sortBy: (searchParams.get('sortBy') as HouseSearchParams['sortBy']) || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as HouseSearchParams['sortOrder']) || 'desc',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
  };

  const [params, setParams] = useState<HouseSearchParams>(initialParams);
  const { houses, pagination, loading, error, refetch } = useHouses(params);

  const handleFilter = useCallback((newParams: HouseSearchParams) => {
    setParams(newParams);
    const sp = new URLSearchParams();
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') sp.set(key, String(value));
    });
    setSearchParams(sp);
  }, [setSearchParams]);

  function handlePageChange(page: number) {
    handleFilter({ ...params, page });
  }

  return (
    <Layout>
      <section className="px-4 md:px-8 lg:px-16 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Find a Place to Stay</h1>
        <HouseFilters onFilter={handleFilter} initial={initialParams} />
        <HouseGrid houses={houses} loading={loading} error={error} onRetry={refetch} />

        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasPrev}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted px-4">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </Layout>
  );
}

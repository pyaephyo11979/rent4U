import { useState, useEffect, useCallback } from 'react';
import { houseApi } from '../services/api';

export function useHouses(params?: HouseSearchParams) {
  const [houses, setHouses] = useState<House[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await houseApi.list(params);
      setHouses(data.data);
      setPagination(data.pagination);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch houses';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit, params?.city, params?.minPrice, params?.maxPrice, params?.rooms, params?.search, params?.sortBy, params?.sortOrder]);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  return { houses, pagination, loading, error, refetch: fetchHouses };
}

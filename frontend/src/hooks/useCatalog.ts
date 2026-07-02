// src/hooks/useCatalog.ts
import { useQuery } from '@tanstack/react-query';
import { contentApi } from '../api/contentApi';

interface UseCatalogProps {
  search: string;
  genre: string;
}

export function useCatalog({ search, genre }: UseCatalogProps) {
  return useQuery({
    queryKey: ['contents', search, genre],
    queryFn: async ({ signal }) => {
      // ใช้ signal ที่ React Query จัดการให้ เพื่อทำการ Abort Request เก่า
      return contentApi.getContents(search, genre, { signal });
    },
  });
}

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
      return contentApi.getContents(search, genre, { signal });
    },
  });
}

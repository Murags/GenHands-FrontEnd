import { useQuery } from '@tanstack/react-query';
import { getCharities } from '../services/charityService';

export const useCharities = () => {
  return useQuery({
    queryKey: ['charities'],
    queryFn: getCharities,
  });
};

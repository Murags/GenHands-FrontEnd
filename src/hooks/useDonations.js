import { useQuery } from "@tanstack/react-query";
import { getMyDonations } from "../services/myDonationService";

export const useDonations = () => {
  return useQuery({
    queryKey: ["my-donations"],
    queryFn: async () => {
      const res = await getMyDonations();
      return res.donations || []; 
    },
  });
};

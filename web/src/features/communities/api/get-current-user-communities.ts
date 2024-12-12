import { api } from "@/lib/api-client";
import { CommunityOverview } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

const getCurrentUserCommunitiesApi = async (): Promise<CommunityOverview[]> => {
  const res = await api.get(
    `${import.meta.env.VITE_API_URL}/v1/users/me/communities`
  );
  return res.data.data;
};

export const useCurrentUserCommunities = () => {
  const {
    data: communities,
    isLoading,
    error,
  } = useQuery({
    queryFn: getCurrentUserCommunitiesApi,
    queryKey: ["user-communities"],
  });

  return { communities, isLoading, error };
};

import { api } from "@/lib/api-client";
import { CommunitySummary } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

const getCommunitiesApi = async (): Promise<CommunitySummary[]> => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/v1/communities`);
  return res.data.data;
};

export const useCommunities = () => {
  const {
    data: communities,
    isLoading,
    error,
  } = useQuery({ queryFn: getCommunitiesApi, queryKey: ["communities"] });

  return { communities, isLoading, error };
};

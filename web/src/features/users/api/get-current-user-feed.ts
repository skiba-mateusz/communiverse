import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Post } from "@/types/api";

const getCurrentUserFeedApi = async (): Promise<Post[]> => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/v1/users/feed`);
  return res.data.data;
};

export const useGetCurrentUserFeed = () => {
  const {
    data: feed,
    error,
    isLoading,
  } = useQuery({
    queryFn: getCurrentUserFeedApi,
    queryKey: ["feed"],
  });

  return { feed, error, isLoading };
};

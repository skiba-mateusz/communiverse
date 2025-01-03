import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { PostSummary } from "@/types/api";

const getCurrentUserFeedApi = async (): Promise<PostSummary[]> => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/v1/users/me/feed`);
  return res.data.data;
};

export const useCurrentUserFeed = () => {
  const {
    data: posts,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryFn: getCurrentUserFeedApi,
    queryKey: ["posts", "feed"],
  });

  return { posts, error, isLoading, isFetching };
};

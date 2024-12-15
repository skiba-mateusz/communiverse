import { api } from "@/lib/api-client";
import { PostSummary } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

const getPostsApi = async (): Promise<PostSummary[]> => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/v1/posts`);
  return res.data.data;
};

export const usePosts = () => {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryFn: getPostsApi,
    queryKey: ["posts"],
  });

  return { posts, isLoading, error };
};

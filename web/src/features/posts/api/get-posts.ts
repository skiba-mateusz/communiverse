import { api } from "@/lib/api-client";
import { Post } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

const getPostApi = async (): Promise<Post[]> => {
  const res = await api.get(`${import.meta.env.VITE_API_URL}/v1/posts`);
  return res.data.data;
};

export const usePosts = () => {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryFn: getPostApi,
    queryKey: ["posts"],
  });

  return { posts, isLoading, error };
};

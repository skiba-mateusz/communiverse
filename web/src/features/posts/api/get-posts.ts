import { api } from "@/lib/api-client";
import { PostSummary } from "@/types/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

const getPostsApi = async ({
  view,
  time,
}: {
  view: string;
  time: string;
}): Promise<PostSummary[]> => {
  const res = await api.get(
    `${import.meta.env.VITE_API_URL}/v1/posts?view=${view}&time=${time}`
  );
  return res.data.data;
};

export const usePosts = () => {
  const [searchParams] = useSearchParams();

  const view = searchParams.get("view") || "latest";
  const time = searchParams.get("time") || "week";

  const {
    data: posts,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryFn: () => getPostsApi({ view, time }),
    queryKey: ["posts", "all", view, time],
  });

  return { posts, isLoading, isFetching, error };
};

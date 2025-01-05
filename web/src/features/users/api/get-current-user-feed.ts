import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { PostSummary } from "@/types/api";
import { useSearchParams } from "react-router-dom";

const getCurrentUserFeedApi = async ({
  view,
  time,
}: {
  view: string;
  time: string;
}): Promise<PostSummary[]> => {
  const res = await api.get(
    `${import.meta.env.VITE_API_URL}/v1/users/me/feed?view=${view}&time=${time}`
  );
  return res.data.data;
};

export const useCurrentUserFeed = () => {
  const [searchParams] = useSearchParams();

  const view = searchParams.get("view") || "latest";
  const time = searchParams.get("time") || "week";

  const {
    data: posts,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryFn: () => getCurrentUserFeedApi({ view, time }),
    queryKey: ["posts", "feed", view, time],
  });

  return { posts, error, isLoading, isFetching };
};

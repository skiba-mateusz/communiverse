import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api-client";
import { PostSummary } from "@/types/api";

const getCommunityPostsApi = async ({
  communitySlug,
  view,
  time,
}: {
  communitySlug: string;
  view: string;
  time: string;
}): Promise<PostSummary[]> => {
  const res = await api.get(
    `${import.meta.env.VITE_API_URL}/v1/communities/${communitySlug}/posts?view=${view}&time=${time}`
  );
  return res.data.data;
};

export const useCommunityPosts = () => {
  const { communitySlug } = useParams();
  const [searchParams] = useSearchParams();

  const view = searchParams.get("view") || "latest";
  const time = searchParams.get("time") || "week";

  if (!communitySlug) {
    throw new Error("required parameter is missing");
  }

  const {
    data: posts,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryFn: () => getCommunityPostsApi({ communitySlug, view, time }),
    queryKey: ["posts", communitySlug, view, time],
  });

  return { posts, isLoading, isFetching, error };
};

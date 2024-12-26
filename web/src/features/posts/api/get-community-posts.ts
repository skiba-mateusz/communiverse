import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api-client";
import { PostSummary } from "@/types/api";

const getCommunityPostsApi = async (
  communitySlug: string
): Promise<PostSummary[]> => {
  const res = await api.get(
    `${import.meta.env.VITE_API_URL}/v1/communities/${communitySlug}/posts`
  );
  return res.data.data;
};

export const useCommunityPosts = () => {
  const { communitySlug } = useParams();

  if (!communitySlug) {
    throw new Error("required parameter is missing");
  }

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getCommunityPostsApi(communitySlug),
    queryKey: ["posts", communitySlug],
  });

  return { posts, isLoading, error };
};

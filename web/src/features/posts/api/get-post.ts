import { api } from "@/lib/api-client";
import { PostDetails } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

interface GetPostParams {
  communitySlug: string;
  postSlug: string;
}

const getPostApi = async ({
  communitySlug,
  postSlug,
}: GetPostParams): Promise<PostDetails> => {
  const res = await api.get(
    `${import.meta.env.VITE_API_URL}/v1/communities/${communitySlug}/posts/${postSlug}`
  );
  return res.data.data;
};

export const usePost = () => {
  const { communitySlug, postSlug } = useParams();

  if (!communitySlug || !postSlug) {
    throw new Error("required parameters are missing");
  }

  const {
    data: post,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryFn: () => getPostApi({ communitySlug, postSlug }),
    queryKey: ["posts", postSlug],
  });

  return { post, isLoading, isFetching, error };
};

import { api } from "@/lib/api-client";
import { CommunityDetails } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const getCommunityApi = async (
  communitySlug: string
): Promise<CommunityDetails> => {
  const res = await api.get(
    `${import.meta.env.VITE_API_URL}/v1/communities/${communitySlug}`
  );
  return res.data.data;
};

export const useCommunity = () => {
  const { communitySlug } = useParams();

  if (!communitySlug) {
    throw new Error("required parameters are missing");
  }

  const {
    data: community,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryFn: () => getCommunityApi(communitySlug),
    queryKey: ["communities", communitySlug],
  });

  return { community, isLoading, isFetching, error };
};

import { useToasts } from "@/components/ui/toasts";
import { api } from "@/lib/api-client";
import { getAxiosErrorMessage } from "@/utils/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const communityMembershipApi = async (
  communityslug: string,
  action: "join" | "leave"
) => {
  const url = `${import.meta.env.VITE_API_URL}/v1/communities/${communityslug}/${action}`;
  return action === "join" ? api.post(url) : api.delete(url);
};

export const useCommunityMemebership = () => {
  const queryClient = useQueryClient();
  const { communitySlug } = useParams();
  const { success, error } = useToasts();

  if (!communitySlug) {
    throw new Error("required parameter is missing");
  }

  const handleMutation = (successMessage: string, action: "join" | "leave") =>
    useMutation({
      mutationFn: () => communityMembershipApi(communitySlug, action),
      onSuccess: () => {
        success(successMessage);
        queryClient.invalidateQueries({
          queryKey: ["community", communitySlug],
        });
        queryClient.invalidateQueries({ queryKey: ["user-communities"] });
      },
      onError: (err) => {
        error(getAxiosErrorMessage(err));
      },
    });

  const joinMutation = handleMutation("Welcome to the new community!", "join");
  const leaveMutation = handleMutation("We will be missing you :(", "leave");

  return {
    joinCommunity: joinMutation.mutate,
    isJoining: joinMutation.isPending,
    leaveCommunity: leaveMutation.mutate,
    isLeaving: leaveMutation.isPending,
  };
};

import { useToasts } from "@/components/ui/toasts";
import { api } from "@/lib/api-client";
import { VoteValue } from "@/types/api";
import { getAxiosErrorMessage } from "@/utils/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface VotePostPayload {
  communitySlug: string;
  postSlug: string;
  value: VoteValue;
}

const votePostApi = async ({
  communitySlug,
  postSlug,
  value,
}: VotePostPayload) => {
  await api.put(
    `${import.meta.env.VITE_API_URL}/v1/communities/${communitySlug}/posts/${postSlug}/vote`,
    { value }
  );
};

export const useVotePost = () => {
  const queryClient = useQueryClient();
  const { error } = useToasts();

  const { mutate: vote, isPending } = useMutation({
    mutationFn: votePostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        refetchType: "none",
      });
    },
    onError: (err) => {
      error(getAxiosErrorMessage(err));
    },
  });

  return { vote, isPending };
};

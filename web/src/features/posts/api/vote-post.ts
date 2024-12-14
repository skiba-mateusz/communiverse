import { useToasts } from "@/components/ui/toasts";
import { api } from "@/lib/api-client";
import { VoteValue } from "@/types/api";
import { getAxiosErrorMessage } from "@/utils/errors";
import { useMutation } from "@tanstack/react-query";

interface VotePostPayloaad {
  communitySlug: string;
  postSlug: string;
  value: VoteValue;
}

const votePostApi = async ({
  communitySlug,
  postSlug,
  value,
}: VotePostPayloaad) => {
  await api.put(
    `${import.meta.env.VITE_API_URL}/v1/communities/${communitySlug}/posts/${postSlug}/vote`,
    {
      value,
    }
  );
};

export const useVotePost = () => {
  const { error } = useToasts();

  const { mutate: vote, isPending } = useMutation({
    mutationFn: votePostApi,
    onError: (err) => {
      error(getAxiosErrorMessage(err));
    },
  });

  return { vote, isPending };
};

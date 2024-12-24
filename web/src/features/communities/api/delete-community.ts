import { useToasts } from "@/components/ui/toasts";
import { api } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const deleteCommunityApi = async (communitySlug: string) => {
  const res = await api.delete(
    `${import.meta.env.VITE_API_URL}/v1/communities/${communitySlug}`
  );
  return res.data.data;
};

export const useDeleteCommunity = () => {
  const { communitySlug } = useParams();
  const { success } = useToasts();

  if (!communitySlug) {
    throw new Error("required parameter is missing");
  }

  const { mutate: deleteCommunity, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteCommunityApi(communitySlug),
    onSuccess: () => {
      success("Community successfully deleted");
    },
  });

  return { deleteCommunity, isDeleting };
};

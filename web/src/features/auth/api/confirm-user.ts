import { useToasts } from "@/components/ui/toasts";
import { api } from "@/lib/api-client";
import { getAxiosErrorMessage } from "@/utils/errors";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const confirmUserApi = async (token: string) => {
  await api.put(`${import.meta.env.VITE_API_URL}/v1/users/activate/${token}`);
};

export const useConfirmUser = () => {
  const { confirmationToken } = useParams<{ confirmationToken: string }>();
  const navigate = useNavigate();
  const { success, error } = useToasts();

  const { mutate: confirmUser, isPending } = useMutation({
    mutationFn: () => {
      if (!confirmationToken) {
        throw new Error("confirmation token is required");
      }
      return confirmUserApi(confirmationToken);
    },
    onSuccess: () => {
      navigate("/auth/login");
      success("Account activated successfully");
    },
    onError: (err) => {
      error(getAxiosErrorMessage(err));
    },
  });

  return { confirmUser, isPending };
};

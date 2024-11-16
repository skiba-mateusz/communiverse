import { useToasts } from "@/components/ui/toasts";
import { api } from "@/lib/api-client";
import { getAxiosErrorMessage } from "@/utils/errors";
import { useMutation } from "@tanstack/react-query";
import * as yup from "yup";

export const forgotPasswordSchema = yup.object({
  email: yup.string().required("Email is required").email("Invalid email"),
});

export type ForgotPasswordPayload = yup.InferType<typeof forgotPasswordSchema>;

const forgotPasswordApi = async (payload: ForgotPasswordPayload) => {
  await api.post(
    `${import.meta.env.VITE_API_URL}/v1/auth/forgot-password`,
    payload
  );
};

export const useForgotPassword = () => {
  const { success, error } = useToasts();

  const { mutate: forgotPassword, isPending } = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: () => {
      success("Rest email send successfully");
    },
    onError: (err) => {
      error(getAxiosErrorMessage(err));
    },
  });

  return { forgotPassword, isPending };
};

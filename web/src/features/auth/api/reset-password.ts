import { useToasts } from "@/components/ui/toasts";
import { api } from "@/lib/api-client";
import { getAxiosErrorMessage } from "@/utils/errors";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
  passwordConfirmation: yup
    .string()
    .required("Password confirmation is required")
    .oneOf([yup.ref("password"), ""], "Passwords must match"),
});

export type ResetPasswordPayload = yup.InferType<typeof resetPasswordSchema>;

const resetPasswordApi = async (
  token: string,
  paylaod: ResetPasswordPayload
) => {
  const { passwordConfirmation, ...restPayload } = paylaod;
  await api.put(
    `${import.meta.env.VITE_API_URL}/v1/auth/reset-password/${token}`,
    restPayload
  );
};

export const useResetPassword = () => {
  const navigate = useNavigate();
  const { success, error } = useToasts();
  const { resetToken } = useParams<{ resetToken: string }>();

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: (payload: ResetPasswordPayload) => {
      if (!resetToken) {
        throw new Error("reset token is required");
      }
      return resetPasswordApi(resetToken, payload);
    },
    onSuccess: () => {
      success("Password changed successfully");
      navigate("/auth/login");
    },
    onError: (err) => {
      error(getAxiosErrorMessage(err));
    },
  });

  return { resetPassword, isPending };
};

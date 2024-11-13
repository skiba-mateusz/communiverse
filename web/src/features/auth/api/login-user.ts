import { useToasts } from "@/components/ui/toasts";
import { api } from "@/lib/api-client";
import { getAxiosErrorMessage } from "@/utils/errors";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

export const loginUserPayloadSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Email is invalid")
    .max(100, "Email cannot exceed 100 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export type LoginUserPayload = yup.InferType<typeof loginUserPayloadSchema>;

const loginUserApi = async (
  payload: LoginUserPayload
): Promise<{ token: string }> => {
  const res = await api.post("/v1/auth/login", payload);
  return res.data.data;
};

export const useLoginUser = () => {
  const navigate = useNavigate();
  const { error, success } = useToasts();

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: loginUserApi,
    onSuccess: (token) => {
      localStorage.setItem("authToken", JSON.stringify(token));
      navigate("/app");
      success("logged in successfully");
    },
    onError: (err) => {
      error(getAxiosErrorMessage(err));
    },
  });

  return { loginUser, isPending };
};

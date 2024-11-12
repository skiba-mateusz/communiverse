import { useToasts } from "@/components/ui/toasts";
import { api } from "@/lib/api-client";
import { getAxiosErrorMessage } from "@/utils/errors";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

export const loginUserPayloadSchema = yup.object({
  email: yup.string().required("Email is required").email("Email is invalid"),
  password: yup.string().required("Password is required"),
});

export type loginUserPayload = yup.InferType<typeof loginUserPayloadSchema>;

const loginUserApi = async (
  payload: loginUserPayload
): Promise<{ token: string }> => {
  const res = await api.post("/v1/auth/login", payload);
  return res.data.data;
};

export const useLoginUser = () => {
  const navigate = useNavigate();
  const { error, success } = useToasts();

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: (data: loginUserPayload) => loginUserApi(data),
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

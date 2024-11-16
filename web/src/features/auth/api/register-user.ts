import { useToasts } from "@/components/ui/toasts";
import { api } from "@/lib/api-client";
import { getAxiosErrorMessage } from "@/utils/errors";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

export const registerUserPayloadSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters"),
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(100, "Username cannot exceed 100 characters"),
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
  passwordConfirmation: yup
    .string()
    .required("Password confirmation is required")
    .oneOf([yup.ref("password"), ""], "Passwords must match"),
});

export type RegisterUserPayload = yup.InferType<
  typeof registerUserPayloadSchema
>;

const registerUserApi = async (payload: RegisterUserPayload) => {
  const { passwordConfirmation, ...restPayload } = payload;
  console.log(restPayload);
  await api.post(
    `${import.meta.env.VITE_API_URL}/v1/auth/register`,
    restPayload
  );
};

export const useRegisterUser = () => {
  const navigate = useNavigate();
  const { success, error } = useToasts();

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: registerUserApi,
    onSuccess: () => {
      navigate("/app");
      success("an invitation email was sent to your inbox");
    },
    onError: (err) => {
      error(getAxiosErrorMessage(err));
    },
  });

  return { registerUser, isPending };
};

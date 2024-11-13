import { AuthLayout } from "@/components/layouts";
import { RegisterForm } from "@/features/auth/components/register-form";

export const RegisterRoute = () => {
  return (
    <AuthLayout title="Create your account">
      <RegisterForm />
    </AuthLayout>
  );
};

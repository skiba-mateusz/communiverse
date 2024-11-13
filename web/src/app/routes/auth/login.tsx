import { AuthLayout } from "@/components/layouts";
import { LoginForm } from "@/features/auth/components/login-form";

export const LoginRoute = () => {
  return (
    <AuthLayout title="Log in to your account">
      <LoginForm />
    </AuthLayout>
  );
};

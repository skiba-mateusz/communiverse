import { AuthLayout } from "@/components/layouts";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const ForgotPasswordRoute = () => {
  return (
    <AuthLayout title="Forgot your password?">
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

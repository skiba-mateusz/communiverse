import { AuthLayout } from "@/components/layouts";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const ResetPasswordRoute = () => {
  return (
    <AuthLayout title="Reset your password">
      <ResetPasswordForm />
    </AuthLayout>
  );
};

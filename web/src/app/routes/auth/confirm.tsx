import { AuthLayout } from "@/components/layouts";
import { ConfirmUserBtn } from "@/features/auth/components/confirm-user-btn";

export const ActivateRoute = () => {
  return (
    <AuthLayout title="Activate your account">
      <ConfirmUserBtn />
    </AuthLayout>
  );
};

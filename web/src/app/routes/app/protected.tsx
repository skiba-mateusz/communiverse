import { Navigate } from "react-router-dom";
import { FullPageLoader } from "@/components/ui/loader";
import { useCurrentUser } from "@/features/users/api/get-current-user";

interface ProtectedProps extends React.PropsWithChildren {}

export const ProtectedRoute = ({ children }: ProtectedProps) => {
  const { user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!user || !user.isActive || isError) return <Navigate to="/auth/login" />;

  return children;
};

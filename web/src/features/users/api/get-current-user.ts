import { api } from "@/lib/api-client";
import { UserDetails } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

const getCurrentUser = async (): Promise<UserDetails> => {
  const res = await api.get("/v1/users/me");
  return res.data.data;
};

export const useCurrentUser = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryFn: getCurrentUser,
    queryKey: ["user"],
    retry: false,
  });

  return { user, isLoading, isError };
};

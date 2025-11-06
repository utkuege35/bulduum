import { useQuery } from "@tanstack/react-query";
import type { User, Profile } from "@shared/schema";

export function useAuth() {
  const { data, isLoading } = useQuery<User & { profile?: Profile }>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user: data,
    profile: data?.profile,
    isLoading,
    isAuthenticated: !!data,
  };
}

import { queryKeys } from "@/lib/query/keys";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Não autenticado");
  return user;
}

async function getProfile(userId: string): Promise<Profile> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export function useProfile() {
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: queryKeys.profile.byId(user?.id ?? ""),
    queryFn: () => getProfile(user!.id),
    enabled: !!user?.id,
  });

  return {
    user,
    profile,
    isLoading: isLoadingUser || isLoadingProfile,
  };
}

import useSWR from "swr";
import { User } from "@prisma/client";

export interface ProfileResponse {
  ok: boolean;
  profile: User;
}

export default function useUser() {
  const { data, error } = useSWR<ProfileResponse>("/api/users/me");

  return { user: data?.profile, isLoading: !data && !error };
}

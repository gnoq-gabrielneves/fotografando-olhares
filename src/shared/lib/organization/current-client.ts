import { getOrganizationIdFromRecord } from "@/shared/lib/organization/scope";
import { createClient } from "@/shared/lib/supabase/client";
import type { UserRole } from "@/shared/types";

const ORGANIZATION_OVERRIDE_KEY = "fotografando-olhares:organization-id";

type ProfileOrganizationScope = {
  role?: UserRole | null;
  organization_id?: string | null;
};

export function getOrganizationOverrideId() {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem(ORGANIZATION_OVERRIDE_KEY) || undefined;
}

export function setOrganizationOverrideId(organizationId?: string | null) {
  if (typeof window === "undefined") return;

  if (organizationId) {
    window.localStorage.setItem(ORGANIZATION_OVERRIDE_KEY, organizationId);
  } else {
    window.localStorage.removeItem(ORGANIZATION_OVERRIDE_KEY);
  }
}

export async function getCurrentOrganizationId() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return undefined;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data as ProfileOrganizationScope | null;
  const overrideId = getOrganizationOverrideId();
  if (profile?.role === "developer" && overrideId) {
    return overrideId;
  }

  return getOrganizationIdFromRecord(data);
}

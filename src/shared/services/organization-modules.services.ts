import { getCurrentOrganizationId } from "@/shared/lib/organization/current-client";
import { createClient } from "@/shared/lib/supabase/client";
import type { OrganizationModule } from "@/shared/types";

export async function getCurrentOrganizationModules(): Promise<
  OrganizationModule[]
> {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase
    .from("organization_modules")
    .select(
      `
      organization_id,
      module_id,
      status,
      enabled_at,
      created_at,
      updated_at,
      clinical_modules(
        id,
        name,
        specialty,
        description,
        status
      )
      `,
    )
    .eq("status", "active")
    .order("enabled_at", { ascending: true });

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as OrganizationModule[];
}

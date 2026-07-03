import { getCurrentOrganizationId } from "@/shared/lib/organization/current-client";
import { createClient } from "@/shared/lib/supabase/client";
import type { ClinicalSettings } from "@/shared/types";

export type ClinicalSettingsInput = {
  clinic_name: string;
  clinic_logo_url: string;
  clinic_city: string;
  physician_name: string;
  physician_crm: string;
};

export async function getClinicalSettings(): Promise<ClinicalSettings | null> {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) return null;

  const { data, error } = await supabase
    .from("clinical_settings")
    .select("*")
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as ClinicalSettings | null;
}

export async function salvarClinicalSettings(input: ClinicalSettingsInput) {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) throw new Error("Organização não encontrada");

  const payload = {
    organization_id: organizationId,
    clinic_name: input.clinic_name.trim() || null,
    clinic_logo_url: input.clinic_logo_url.trim() || null,
    clinic_city: input.clinic_city.trim() || null,
    physician_name: input.physician_name.trim() || null,
    physician_crm: input.physician_crm.trim() || null,
  };

  const { data, error } = await supabase
    .from("clinical_settings")
    .upsert(payload, { onConflict: "organization_id" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ClinicalSettings;
}


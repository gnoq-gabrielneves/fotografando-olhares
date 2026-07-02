import { createClient } from "@/shared/lib/supabase/client";
import {
  getOrganizationIdFromRecord,
  withOrganizationId,
} from "@/shared/lib/organization/scope";

type LogAction =
  | "paciente_criado"
  | "paciente_editado"
  | "paciente_excluido"
  | "laudo_criado"
  | "laudo_editado"
  | "usuario_criado";

export async function logActivity({
  user_id,
  action,
  entity_type,
  entity_id,
  description,
  organization_id,
}: {
  user_id: string;
  action: LogAction;
  entity_type: string;
  entity_id?: string;
  description: string;
  organization_id?: string | null;
}) {
  const supabase = createClient();

  const scopedOrganizationId =
    organization_id ?? (await getUserOrganizationId(user_id));

  await supabase.from("activity_logs").insert(withOrganizationId({
    user_id,
    action,
    entity_type,
    entity_id,
    description,
  }, scopedOrganizationId));
}

async function getUserOrganizationId(userId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return getOrganizationIdFromRecord(data);
}

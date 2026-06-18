import { createClient } from "@/lib/supabase/client";

type LogAction =
  | "paciente_criado"
  | "paciente_editado"
  | "paciente_excluido"
  | "laudo_criado"
  | "usuario_criado";

export async function logActivity({
  user_id,
  action,
  entity_type,
  entity_id,
  description,
}: {
  user_id: string;
  action: LogAction;
  entity_type: string;
  entity_id?: string;
  description: string;
}) {
  const supabase = createClient();
  await supabase.from("activity_logs").insert({
    user_id,
    action,
    entity_type,
    entity_id,
    description,
  });
}

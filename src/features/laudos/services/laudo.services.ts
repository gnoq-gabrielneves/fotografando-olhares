import { logActivity } from "@/lib/activity/log-activity";
import { createClient } from "@/lib/supabase/client";
import { ResultadoRD } from "@/types";

export type LaudoDetalhe = {
  id: string;
  paciente_id: string;
  data_laudo: string | null;
  resultado_rd: ResultadoRD | null;
  descricao: string | null;
  dilatacao: string | null;
  created_at: string;
  updated_at: string;
  pacientes: { id: string; nome_completo: string } | null;
  profiles: { full_name: string } | null;
};

export async function getLaudoById(id: string): Promise<LaudoDetalhe> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("laudos")
    .select(
      `
      id,
      paciente_id,
      data_laudo,
      resultado_rd,
      descricao,
      dilatacao,
      created_at,
      updated_at,
      pacientes(id, nome_completo),
      profiles!laudos_laudador_id_fkey(full_name)
      `,
    )
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as LaudoDetalhe;
}

export type AtualizarLaudoInput = {
  data_laudo?: string;
  resultado_rd?: ResultadoRD;
  descricao?: string;
  dilatacao?: string;
};

export async function atualizarLaudo(id: string, input: AtualizarLaudoInput) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("laudos")
    .update(input)
    .eq("id", id)
    .select("id, paciente_id, pacientes(nome_completo)")
    .single();

  if (error) throw new Error(error.message);

  if (user) {
    const raw = data.pacientes as unknown;
    const paciente = Array.isArray(raw)
      ? (raw[0] as { nome_completo: string } | undefined)
      : (raw as { nome_completo: string } | null);
    await logActivity({
      user_id: user.id,
      action: "laudo_editado",
      entity_type: "laudo",
      entity_id: id,
      description: `editou o laudo de ${paciente?.nome_completo ?? "um paciente"}`,
    });
  }

  return data;
}

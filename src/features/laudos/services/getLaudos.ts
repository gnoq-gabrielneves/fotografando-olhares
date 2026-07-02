import { createClient } from "@/shared/lib/supabase/client";
import { getOrganizationOverrideId } from "@/shared/lib/organization/current-client";
import { getOrganizationIdFromRecord } from "@/shared/lib/organization/scope";
import { FiltrosLaudos, LaudoTabela } from "../laudo-types";

export async function getLaudos(filtros: FiltrosLaudos = {}): Promise<{
  data: LaudoTabela[];
  count: number;
}> {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();
  const { busca, resultado_rd, page = 1, pageSize = 10 } = filtros;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("laudos")
    .select(
      `
      id,
      data_laudo,
      resultado_rd,
      descricao,
      created_at,
      pacientes(id, nome_completo),
      profiles!laudos_laudador_id_fkey(full_name)
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  if (resultado_rd && resultado_rd !== "todos") {
    query = query.eq("resultado_rd", resultado_rd);
  }

  if (busca) {
    let pacientesQuery = supabase
      .from("pacientes")
      .select("id")
      .ilike("nome_completo", `%${busca}%`);

    if (organizationId) {
      pacientesQuery = pacientesQuery.eq("organization_id", organizationId);
    }

    const { data: pacientesFiltrados } = await pacientesQuery;

    const ids = pacientesFiltrados?.map((p) => p.id) ?? [];
    if (ids.length === 0) return { data: [], count: 0 };
    query = query.in("paciente_id", ids);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);
  return {
    data: data as unknown as LaudoTabela[],
    count: count ?? 0,
  };
}

export async function getTodosLaudos() {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase
    .from("laudos")
    .select(
      `
      *,
      pacientes(id, nome_completo),
      profiles!laudos_laudador_id_fkey(full_name)
    `,
    )
    .order("data_laudo", { ascending: false });

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
}

async function getCurrentOrganizationId() {
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

  if (data?.role === "developer") {
    return getOrganizationOverrideId() ?? getOrganizationIdFromRecord(data);
  }

  return getOrganizationIdFromRecord(data);
}

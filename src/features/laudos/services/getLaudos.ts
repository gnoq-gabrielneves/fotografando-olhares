import { createClient } from "@/lib/supabase/client";
import { FiltrosLaudos, LaudoTabela } from "../laudo-types";

export async function getLaudos(filtros: FiltrosLaudos = {}): Promise<{
  data: LaudoTabela[];
  count: number;
}> {
  const supabase = createClient();
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

  if (resultado_rd && resultado_rd !== "todos") {
    query = query.eq("resultado_rd", resultado_rd);
  }

  if (busca) {
    const { data: pacientesFiltrados } = await supabase
      .from("pacientes")
      .select("id")
      .ilike("nome_completo", `%${busca}%`);

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

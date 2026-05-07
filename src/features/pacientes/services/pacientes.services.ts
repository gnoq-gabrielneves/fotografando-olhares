import { createClient } from "@/lib/supabase/client";
import { PacienteTabela, ResultadoRD } from "@/types";
import { NovoPacienteInput } from "../pacientes.types";

export type FiltrosPacientes = {
  busca?: string;
  resultado_rd?: string;
  local_id?: string;
  page?: number;
  pageSize?: number;
};

export async function getPacientes(filtros: FiltrosPacientes = {}): Promise<{
  data: PacienteTabela[];
  count: number;
}> {
  const supabase = createClient();
  const { busca, resultado_rd, local_id, page = 1, pageSize = 10 } = filtros;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("pacientes")
    .select(
      `
      id,
      nome_completo,
      sexo,
      data_nascimento,
      created_at,
      locais_atendimento(nome),
      profiles!pacientes_extensionista_id_fkey(full_name),
      laudos(resultado_rd)
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (busca) {
    query = query.ilike("nome_completo", `%${busca}%`);
  }

  if (local_id && local_id !== "todos") {
    query = query.eq("local_atendimento_id", local_id);
  }

  if (resultado_rd && resultado_rd !== "todos") {
    if (resultado_rd === "sem_laudo") {
      const { data: comLaudo } = await supabase
        .from("laudos")
        .select("paciente_id");

      const ids = comLaudo?.map((l) => l.paciente_id) ?? [];
      if (ids.length > 0) {
        query = query.not("id", "in", `(${ids.join(",")})`);
      }
    } else {
      const { data: laudosFiltrados } = await supabase
        .from("laudos")
        .select("paciente_id")
        .eq("resultado_rd", resultado_rd);

      const ids = laudosFiltrados?.map((l) => l.paciente_id) ?? [];

      if (ids.length === 0) {
        return { data: [], count: 0 };
      }

      query = query.in("id", ids);
    }
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return {
    data: data as unknown as PacienteTabela[],
    count: count ?? 0,
  };
}

export async function getLocaisAtendimento() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("locais_atendimento")
    .select("id, nome")
    .order("nome");

  if (error) throw new Error(error.message);
  return data;
}

export async function criarPaciente(input: NovoPacienteInput) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data, error } = await supabase
    .from("pacientes")
    .insert({ ...input, extensionista_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getPacienteById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pacientes")
    .select(
      `
      *,
      locais_atendimento(id, nome),
      profiles!pacientes_extensionista_id_fkey(id, full_name),
      laudos(
        id,
        data_laudo,
        resultado_rd,
        descricao,
        dilatacao,
        created_at,
        profiles!laudos_laudador_id_fkey(full_name)
      )
      `,
    )
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export type NovoLaudoInput = {
  paciente_id: string;
  data_laudo?: string;
  resultado_rd?: ResultadoRD;
  descricao?: string;
  dilatacao?: string;
};

export async function criarLaudo(input: NovoLaudoInput) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data, error } = await supabase
    .from("laudos")
    .insert({ ...input, laudador_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function atualizarPaciente(
  id: string,
  input: Partial<NovoPacienteInput>,
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pacientes")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function excluirPaciente(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("pacientes").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

export async function getTodosPacientes() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pacientes")
    .select(
      `
      *,
      locais_atendimento(nome),
      profiles!pacientes_extensionista_id_fkey(full_name)
    `,
    )
    .order("nome_completo", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

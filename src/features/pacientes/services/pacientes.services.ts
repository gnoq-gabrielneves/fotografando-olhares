import { logActivity } from "@/shared/lib/activity/log-activity";
import { getOrganizationOverrideId } from "@/shared/lib/organization/current-client";
import {
  getOrganizationIdFromRecord,
  withOrganizationId,
} from "@/shared/lib/organization/scope";
import { createClient } from "@/shared/lib/supabase/client";
import { PacienteStatusOperacional, PacienteTabela, ResultadoRD } from "@/shared/types";
import { NovoPacienteInput } from "../pacientes.types";

export type FiltrosPacientes = {
  busca?: string;
  resultado_rd?: string;
  status_operacional?: string;
  local_id?: string;
  data_inicio?: string;
  data_fim?: string;
  page?: number;
  pageSize?: number;
};

export async function getPacientes(filtros: FiltrosPacientes = {}): Promise<{
  data: PacienteTabela[];
  count: number;
}> {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();
  const {
    busca,
    resultado_rd,
    status_operacional,
    local_id,
    data_inicio,
    data_fim,
    page = 1,
    pageSize = 10,
  } = filtros;
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
      status_operacional,
      locais_atendimento(nome),
      profiles!pacientes_extensionista_id_fkey(full_name),
      laudos(resultado_rd)
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  if (busca) {
    query = query.or(`nome_completo.ilike.%${busca}%,cpf_cns.ilike.%${busca}%`);
  }

  if (data_inicio) {
    query = query.gte("created_at", `${data_inicio}T00:00:00`);
  }

  if (data_fim) {
    query = query.lte("created_at", `${data_fim}T23:59:59`);
  }

  if (local_id && local_id !== "todos") {
    query = query.eq("local_atendimento_id", local_id);
  }

  if (status_operacional && status_operacional !== "todos") {
    query = query.eq(
      "status_operacional",
      status_operacional as PacienteStatusOperacional,
    );
  }

  if (resultado_rd && resultado_rd !== "todos") {
    if (resultado_rd === "sem_laudo") {
      const { data: comLaudo } = await supabase
        .from("laudos")
        .select("paciente_id")
        .match(organizationId ? { organization_id: organizationId } : {});

      const ids = comLaudo?.map((l) => l.paciente_id) ?? [];
      if (ids.length > 0) {
        query = query.not("id", "in", `(${ids.join(",")})`);
      }
    } else {
      const { data: laudosFiltrados } = await supabase
        .from("laudos")
        .select("paciente_id")
        .eq("resultado_rd", resultado_rd)
        .match(organizationId ? { organization_id: organizationId } : {});

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
  const organizationId = await getCurrentOrganizationId();

  let query = supabase
    .from("locais_atendimento")
    .select("id, nome")
    .order("nome");

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
}

export async function criarPaciente(input: NovoPacienteInput) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const organizationId = await getUserOrganizationId(user.id);

  const { data, error } = await supabase
    .from("pacientes")
    .insert(withOrganizationId({ ...input, extensionista_id: user.id }, organizationId))
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logActivity({
    user_id: user.id,
    action: "paciente_criado",
    entity_type: "paciente",
    entity_id: data.id,
    description: `cadastrou o paciente ${input.nome_completo}`,
    organization_id: organizationId,
  });

  return data;
}

export async function getPacienteById(id: string) {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase
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
    .eq("id", id);

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query.single();

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

  const organizationId =
    (await getUserOrganizationId(user.id)) ??
    (await getPacienteOrganizationId(input.paciente_id));

  const { data, error } = await supabase
    .from("laudos")
    .insert(withOrganizationId({ ...input, laudador_id: user.id }, organizationId))
    .select()
    .single();

  if (error) throw new Error(error.message);

  let pacienteQuery = supabase
    .from("pacientes")
    .update({ status_operacional: "laudado" })
    .eq("id", input.paciente_id);

  if (organizationId) {
    pacienteQuery = pacienteQuery.eq("organization_id", organizationId);
  }

  const { error: pacienteError } = await pacienteQuery;
  if (pacienteError) throw new Error(pacienteError.message);

  await logActivity({
    user_id: user.id,
    action: "laudo_criado",
    entity_type: "laudo",
    entity_id: data.id,
    description: `emitiu um laudo${input.resultado_rd ? ` — ${input.resultado_rd}` : ""}`,
    organization_id: organizationId,
  });

  return data;
}

async function getUserOrganizationId(userId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (data?.role === "developer") {
    return getOrganizationOverrideId() ?? getOrganizationIdFromRecord(data);
  }

  return getOrganizationIdFromRecord(data);
}

async function getPacienteOrganizationId(pacienteId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("pacientes")
    .select("*")
    .eq("id", pacienteId)
    .maybeSingle();

  return getOrganizationIdFromRecord(data);
}

export async function atualizarPaciente(
  id: string,
  input: Partial<NovoPacienteInput>,
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const organizationId = user ? await getUserOrganizationId(user.id) : undefined;

  let query = supabase
    .from("pacientes")
    .update(input)
    .eq("id", id);

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query.select().single();

  if (error) throw new Error(error.message);

  if (user) {
    await logActivity({
      user_id: user.id,
      action: "paciente_editado",
      entity_type: "paciente",
      entity_id: id,
      description: `editou o paciente ${input.nome_completo ?? ""}`.trim(),
    });
  }

  return data;
}

export async function excluirLaudo(id: string) {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();
  let query = supabase.from("laudos").delete().eq("id", id);
  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { error } = await query;
  if (error) throw new Error(error.message);
}

export async function excluirPaciente(id: string) {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase.from("pacientes").delete().eq("id", id);
  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { error } = await query;

  if (error) throw new Error(error.message);
}

export async function getTodosPacientes() {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase
    .from("pacientes")
    .select(
      `
      *,
      locais_atendimento(nome),
      profiles!pacientes_extensionista_id_fkey(full_name)
    `,
    )
    .order("nome_completo", { ascending: true });

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
  return getUserOrganizationId(user.id);
}

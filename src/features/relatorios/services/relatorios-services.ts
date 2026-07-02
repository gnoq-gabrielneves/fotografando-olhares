import { createClient } from "@/shared/lib/supabase/client";
import { getCurrentOrganizationId } from "@/shared/lib/organization/current-client";
import {
  isActivePendingPatientStatus,
  RD_POSITIVE_RESULTS,
} from "@/shared/lib/clinical/rules";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import {
  PACIENTE_STATUS_OPERACIONAIS,
  type PacienteStatusOperacional,
} from "@/shared/types";

export async function getRelatorioGeral() {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  const pacientesCountQuery = supabase
    .from("pacientes")
    .select("*", { count: "exact", head: true });
  const laudosCountQuery = supabase
    .from("laudos")
    .select("*", { count: "exact", head: true });
  const laudosPacientesQuery = supabase.from("laudos").select("paciente_id");
  const rdCountQuery = supabase
    .from("laudos")
    .select("*", { count: "exact", head: true })
    .in("resultado_rd", RD_POSITIVE_RESULTS);

  if (organizationId) {
    pacientesCountQuery.eq("organization_id", organizationId);
    laudosCountQuery.eq("organization_id", organizationId);
    laudosPacientesQuery.eq("organization_id", organizationId);
    rdCountQuery.eq("organization_id", organizationId);
  }

  const [
    { count: totalPacientes },
    { count: totalLaudos },
    laudosData,
    { count: totalComRD },
  ] = await Promise.all([
    pacientesCountQuery,
    laudosCountQuery,
    laudosPacientesQuery,
    rdCountQuery,
  ]);

  const idsComLaudo = new Set(laudosData.data?.map((l) => l.paciente_id) ?? []);
  const totalPendentes = (totalPacientes ?? 0) - idsComLaudo.size;

  return {
    totalPacientes: totalPacientes ?? 0,
    totalLaudos: totalLaudos ?? 0,
    totalPendentes: Math.max(0, totalPendentes),
    totalComRD: totalComRD ?? 0,
  };
}

export async function getDistribuicaoResultados() {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase.from("laudos").select("resultado_rd");
  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  const contagem: Record<string, number> = {};
  data.forEach((l) => {
    if (l.resultado_rd) {
      contagem[l.resultado_rd] = (contagem[l.resultado_rd] ?? 0) + 1;
    }
  });

  const total = Object.values(contagem).reduce((a, b) => a + b, 0);

  return Object.entries(contagem)
    .map(([name, value]) => ({
      name,
      value,
      percentual: total > 0 ? Math.round((value / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

export async function getDistribuicaoPorExtensionista() {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase
    .from("pacientes")
    .select("profiles!pacientes_extensionista_id_fkey(full_name)");

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  const contagem: Record<string, number> = {};
  data.forEach((p) => {
    const raw = p.profiles as unknown;
    const profile = Array.isArray(raw)
      ? (raw[0] as { full_name: string } | undefined)
      : (raw as { full_name: string } | null);
    const nome = profile?.full_name
      ? formatDisplayTextOrDash(profile.full_name)
      : "Não informado";
    contagem[nome] = (contagem[nome] ?? 0) + 1;
  });

  return Object.entries(contagem)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export async function getLaudosPorMes() {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase
    .from("laudos")
    .select("data_laudo")
    .not("data_laudo", "is", null);

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query.order("data_laudo", { ascending: true });

  if (error) throw new Error(error.message);

  const contagem: Record<string, number> = {};
  data.forEach((l) => {
    if (l.data_laudo) {
      const mes = l.data_laudo.substring(0, 7);
      contagem[mes] = (contagem[mes] ?? 0) + 1;
    }
  });

  return Object.entries(contagem).map(([mes, total]) => ({
    mesRaw: mes,
    mesLabel: new Date(mes + "-01T12:00:00").toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
      timeZone: "UTC",
    }),
    total,
  }));
}

export async function getCadastrosPorMes() {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase
    .from("pacientes")
    .select("created_at");

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query.order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const contagem: Record<string, number> = {};
  data.forEach((p) => {
    if (p.created_at) {
      const mes = p.created_at.substring(0, 7);
      contagem[mes] = (contagem[mes] ?? 0) + 1;
    }
  });

  return Object.entries(contagem).map(([mes, total]) => ({
    mes,
    total,
    label: new Date(mes + "-01T12:00:00").toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
      timeZone: "UTC",
    }),
  }));
}

export async function getDistribuicaoPorLocal() {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase
    .from("pacientes")
    .select("locais_atendimento(nome)");

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  const contagem: Record<string, number> = {};
  data.forEach((p) => {
    const raw = p.locais_atendimento as unknown;
    const local = Array.isArray(raw)
      ? (raw[0] as { nome: string } | undefined)
      : (raw as { nome: string } | null);
    const nome = local?.nome ? formatDisplayTextOrDash(local.nome) : "Não informado";
    contagem[nome] = (contagem[nome] ?? 0) + 1;
  });

  return Object.entries(contagem)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

type PacienteEsteiraRow = {
  status_operacional: PacienteStatusOperacional | null;
  created_at: string;
  laudos:
    | {
        created_at: string;
      }[]
    | null;
};

function diffDias(inicio: string, fim: string) {
  const inicioMs = new Date(inicio).getTime();
  const fimMs = new Date(fim).getTime();
  if (!Number.isFinite(inicioMs) || !Number.isFinite(fimMs) || fimMs < inicioMs) {
    return null;
  }
  return Math.round((fimMs - inicioMs) / (1000 * 60 * 60 * 24));
}

export async function getEsteiraClinica() {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase
    .from("pacientes")
    .select(
      `
      status_operacional,
      created_at,
      laudos(created_at)
      `,
    );

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as unknown as PacienteEsteiraRow[];
  const contagem = PACIENTE_STATUS_OPERACIONAIS.reduce(
    (acc, status) => ({ ...acc, [status]: 0 }),
    {} as Record<PacienteStatusOperacional, number>,
  );
  const diasAteLaudo: number[] = [];

  rows.forEach((paciente) => {
    const status = paciente.status_operacional ?? "cadastrado";
    contagem[status] = (contagem[status] ?? 0) + 1;

    const primeiroLaudo = [...(paciente.laudos ?? [])].sort((a, b) => {
      return a.created_at.localeCompare(b.created_at);
    })[0];

    if (primeiroLaudo) {
      const dias = diffDias(paciente.created_at, primeiroLaudo.created_at);
      if (dias !== null) diasAteLaudo.push(dias);
    }
  });

  const total = rows.length;
  const totalPendencias = rows.filter((paciente) =>
    isActivePendingPatientStatus(paciente.status_operacional ?? "cadastrado"),
  ).length;
  const tempoMedioAteLaudo =
    diasAteLaudo.length > 0
      ? Math.round(diasAteLaudo.reduce((sum, dias) => sum + dias, 0) / diasAteLaudo.length)
      : null;

  return {
    total,
    totalPendencias,
    tempoMedioAteLaudo,
    distribuicao: PACIENTE_STATUS_OPERACIONAIS.map((status) => ({
      status,
      total: contagem[status],
      percentual: total > 0 ? Math.round((contagem[status] / total) * 100) : 0,
    })),
  };
}

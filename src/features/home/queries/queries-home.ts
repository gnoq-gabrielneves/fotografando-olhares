import { createClient } from "@/shared/lib/supabase/client";
import { getCurrentOrganizationId } from "@/shared/lib/organization/current-client";
import { RD_POSITIVE_RESULTS } from "@/shared/lib/clinical/rules";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import { PacienteResumo } from "@/shared/types";

export async function getMetricas() {
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
  const totalSemLaudo = Math.max(0, (totalPacientes ?? 0) - idsComLaudo.size);

  return {
    totalPacientes: totalPacientes ?? 0,
    totalLaudos: totalLaudos ?? 0,
    totalSemLaudo,
    totalComRD: totalComRD ?? 0,
  };
}

export async function getDistribuicaoRD() {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase.from("laudos").select("resultado_rd");
  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  const contagem: Record<string, number> = {};

  data.forEach((laudo) => {
    if (laudo.resultado_rd) {
      contagem[laudo.resultado_rd] = (contagem[laudo.resultado_rd] ?? 0) + 1;
    }
  });

  return Object.entries(contagem)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
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
    const local = Array.isArray(p.locais_atendimento)
      ? (p.locais_atendimento[0] as { nome: string } | undefined)
      : (p.locais_atendimento as { nome: string } | null);
    const nome = local?.nome ? formatDisplayTextOrDash(local.nome) : "Não informado";
    contagem[nome] = (contagem[nome] ?? 0) + 1;
  });

  return Object.entries(contagem)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export async function getUltimosPacientes(): Promise<PacienteResumo[]> {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase
    .from("pacientes")
    .select(
      `
      id,
      nome_completo,
      created_at,
      locais_atendimento(nome),
      profiles(full_name),
      laudos(resultado_rd)
    `,
    )
    .order("created_at", { ascending: false });

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query.limit(5);

  if (error) throw new Error(error.message);
  return data as unknown as PacienteResumo[];
}

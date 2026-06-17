import { createClient } from "@/lib/supabase/client";
import { PacienteResumo } from "@/types";

export async function getMetricas() {
  const supabase = createClient();

  const [
    { count: totalPacientes },
    { count: totalLaudos },
    laudosData,
    { count: totalComRD },
  ] = await Promise.all([
    supabase.from("pacientes").select("*", { count: "exact", head: true }),
    supabase.from("laudos").select("*", { count: "exact", head: true }),
    supabase.from("laudos").select("paciente_id"),
    supabase
      .from("laudos")
      .select("*", { count: "exact", head: true })
      .in("resultado_rd", ["Não proliferativa", "Proliferativa"]),
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

  const { data, error } = await supabase.from("laudos").select("resultado_rd");

  if (error) throw new Error(error.message);

  const contagem: Record<string, number> = {
    "Sem RD": 0,
    "Não proliferativa": 0,
    Proliferativa: 0,
    "Outra patologia": 0,
  };

  data.forEach((laudo) => {
    if (laudo.resultado_rd && contagem[laudo.resultado_rd] !== undefined) {
      contagem[laudo.resultado_rd]++;
    }
  });

  return Object.entries(contagem).map(([name, value]) => ({ name, value }));
}

export async function getDistribuicaoPorLocal() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pacientes")
    .select("locais_atendimento(nome)");

  if (error) throw new Error(error.message);

  const contagem: Record<string, number> = {};

  data.forEach((p) => {
    const local = Array.isArray(p.locais_atendimento)
      ? (p.locais_atendimento[0] as { nome: string } | undefined)
      : (p.locais_atendimento as { nome: string } | null);
    const nome = local?.nome ?? "Não informado";
    contagem[nome] = (contagem[nome] ?? 0) + 1;
  });

  return Object.entries(contagem)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export async function getUltimosPacientes(): Promise<PacienteResumo[]> {
  const supabase = createClient();

  const { data, error } = await supabase
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
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw new Error(error.message);
  return data as unknown as PacienteResumo[];
}

import { createClient } from "@/lib/supabase/client";

export async function getRelatorioGeral() {
  const supabase = createClient();

  const [
    { count: totalPacientes },
    { count: totalLaudos },
    { count: totalPendentes },
    { count: totalComRD },
  ] = await Promise.all([
    supabase.from("pacientes").select("*", { count: "exact", head: true }),
    supabase.from("laudos").select("*", { count: "exact", head: true }),
    supabase
      .from("pacientes")
      .select("*", { count: "exact", head: true })
      .not("id", "in", "(select paciente_id from laudos)"),
    supabase
      .from("laudos")
      .select("*", { count: "exact", head: true })
      .in("resultado_rd", [
        "Retinopatia diabética não proliferativa",
        "Retinopatia diabética proliferativa",
      ]),
  ]);

  return {
    totalPacientes: totalPacientes ?? 0,
    totalLaudos: totalLaudos ?? 0,
    totalPendentes: totalPendentes ?? 0,
    totalComRD: totalComRD ?? 0,
  };
}

export async function getDistribuicaoResultados() {
  const supabase = createClient();

  const { data, error } = await supabase.from("laudos").select("resultado_rd");

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

  const { data, error } = await supabase
    .from("pacientes")
    .select("profiles!pacientes_extensionista_id_fkey(full_name)");

  if (error) throw new Error(error.message);

  const contagem: Record<string, number> = {};
  data.forEach((p) => {
    const profiles = p.profiles as { full_name: string }[] | null;
    const nome = profiles?.[0]?.full_name ?? "Não informado";
    contagem[nome] = (contagem[nome] ?? 0) + 1;
  });

  return Object.entries(contagem)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export async function getLaudosPorMes() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("laudos")
    .select("data_laudo")
    .not("data_laudo", "is", null)
    .order("data_laudo", { ascending: true });

  if (error) throw new Error(error.message);

  const contagem: Record<string, number> = {};
  data.forEach((l) => {
    if (l.data_laudo) {
      const mes = l.data_laudo.substring(0, 7);
      contagem[mes] = (contagem[mes] ?? 0) + 1;
    }
  });

  return Object.entries(contagem).map(([mes, total]) => ({
    mes: new Date(mes + "-01").toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
    }),
    total,
  }));
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

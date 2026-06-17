import { createClient } from "@/lib/supabase/client";

export async function getRelatorioGeral() {
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
      .in("resultado_rd", [
        "Retinopatia diabética não proliferativa",
        "Retinopatia diabética proliferativa",
      ]),
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
    const raw = p.profiles as unknown;
    const profile = Array.isArray(raw)
      ? (raw[0] as { full_name: string } | undefined)
      : (raw as { full_name: string } | null);
    const nome = profile?.full_name ?? "Não informado";
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

  const { data, error } = await supabase
    .from("pacientes")
    .select("created_at")
    .order("created_at", { ascending: true });

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

  const { data, error } = await supabase
    .from("pacientes")
    .select("locais_atendimento(nome)");

  if (error) throw new Error(error.message);

  const contagem: Record<string, number> = {};
  data.forEach((p) => {
    const raw = p.locais_atendimento as unknown;
    const local = Array.isArray(raw)
      ? (raw[0] as { nome: string } | undefined)
      : (raw as { nome: string } | null);
    const nome = local?.nome ?? "Não informado";
    contagem[nome] = (contagem[nome] ?? 0) + 1;
  });

  return Object.entries(contagem)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

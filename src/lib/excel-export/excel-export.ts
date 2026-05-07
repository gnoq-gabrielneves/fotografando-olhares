import { Laudo, LocalAtendimento, Paciente, Profile } from "@/types";
import * as XLSX from "xlsx";

type PacienteExport = Paciente & {
  locais_atendimento: Pick<LocalAtendimento, "nome"> | null;
  profiles: Pick<Profile, "full_name"> | null;
};

type LaudoExport = Laudo & {
  pacientes: Pick<Paciente, "id" | "nome_completo"> | null;
  profiles: Pick<Profile, "full_name"> | null;
};

export function exportarPacientes(pacientes: PacienteExport[]) {
  const dados = pacientes.map((p) => ({
    Nome: p.nome_completo,
    Sexo: p.sexo === "M" ? "Masculino" : p.sexo === "F" ? "Feminino" : "",
    "Data de Nascimento": p.data_nascimento
      ? new Date(p.data_nascimento).toLocaleDateString("pt-BR")
      : "",
    "CPF / CNS": p.cpf_cns ?? "",
    Prontuário: p.prontuario ?? "",
    "Local de Atendimento": p.locais_atendimento?.nome ?? "",
    Extensionista: p.profiles?.full_name ?? "",
    Medicamentos: p.medicamentos_em_uso ?? "",
    "Tempo DM": p.tempo_diagnostico_dm ?? "",
    Insulina: p.insulina ? "Sim" : "Não",
    Tabagista: p.tabagista ? "Sim" : "Não",
    "Atividade Física": p.atividade_fisica ? "Sim" : "Não",
    "Fez Exame Oftalm.": p.fez_exame_oftalmologico ? "Sim" : "Não",
    "AV OD": p.av_od ?? "",
    "AV OE": p.av_oe ?? "",
    Observações: p.outras_obs ?? "",
    "Cadastrado em": new Date(p.created_at).toLocaleDateString("pt-BR"),
  }));

  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pacientes");

  // Ajusta largura das colunas
  ws["!cols"] = [
    { wch: 35 },
    { wch: 10 },
    { wch: 18 },
    { wch: 18 },
    { wch: 12 },
    { wch: 25 },
    { wch: 20 },
    { wch: 40 },
    { wch: 15 },
    { wch: 8 },
    { wch: 10 },
    { wch: 15 },
    { wch: 18 },
    { wch: 8 },
    { wch: 8 },
    { wch: 30 },
    { wch: 14 },
  ];

  XLSX.writeFile(
    wb,
    `pacientes_${new Date().toISOString().split("T")[0]}.xlsx`,
  );
}

export function exportarLaudos(laudos: LaudoExport[]) {
  const dados = laudos.map((l) => ({
    Paciente: l.pacientes?.nome_completo ?? "",
    Resultado: l.resultado_rd ?? "",
    Laudador: l.profiles?.full_name ?? "",
    "Data do Laudo": l.data_laudo
      ? new Date(l.data_laudo).toLocaleDateString("pt-BR")
      : "",
    Dilatação: l.dilatacao ?? "",
    Descrição: l.descricao ?? "",
    "Registrado em": new Date(l.created_at).toLocaleDateString("pt-BR"),
  }));

  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Laudos");

  ws["!cols"] = [
    { wch: 35 },
    { wch: 40 },
    { wch: 20 },
    { wch: 14 },
    { wch: 10 },
    { wch: 50 },
    { wch: 14 },
  ];

  XLSX.writeFile(wb, `laudos_${new Date().toISOString().split("T")[0]}.xlsx`);
}

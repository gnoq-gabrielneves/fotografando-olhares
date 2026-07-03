import { Laudo, LocalAtendimento, Paciente, Profile } from "@/shared/types";
import writeXlsxFile, { type Column } from "write-excel-file/browser";
import { formatIsoDateToBrazilian } from "@/shared/lib/format/date";

type PacienteExport = Paciente & {
  locais_atendimento: Pick<LocalAtendimento, "nome"> | null;
  profiles: Pick<Profile, "full_name"> | null;
};

type LaudoExport = Laudo & {
  pacientes: Pick<Paciente, "id" | "nome_completo"> | null;
  profiles: Pick<Profile, "full_name"> | null;
};

type ExportValue = string | number | boolean | Date | null;

function dateOrEmpty(value: string | null) {
  return formatIsoDateToBrazilian(value) ?? "";
}

function todayFileDate() {
  return new Date().toISOString().split("T")[0];
}

function textColumn<T>(
  header: string,
  width: number,
  cell: (row: T) => ExportValue,
): Column<T> {
  return { header, width, cell };
}

export async function exportarPacientes(pacientes: PacienteExport[]) {
  const columns: Column<PacienteExport>[] = [
    textColumn("Nome", 35, (p) => p.nome_completo),
    textColumn("Sexo", 10, (p) =>
      p.sexo === "M" ? "Masculino" : p.sexo === "F" ? "Feminino" : "",
    ),
    textColumn("Data de Nascimento", 18, (p) => dateOrEmpty(p.data_nascimento)),
    textColumn("CPF / CNS", 18, (p) => p.cpf_cns ?? ""),
    textColumn("Prontuário", 12, (p) => p.prontuario ?? ""),
    textColumn("Local de Atendimento", 25, (p) => p.locais_atendimento?.nome ?? ""),
    textColumn("Extensionista", 20, (p) => p.profiles?.full_name ?? ""),
    textColumn("Medicamentos", 40, (p) => p.medicamentos_em_uso ?? ""),
    textColumn("Tempo DM", 15, (p) => p.tempo_diagnostico_dm ?? ""),
    textColumn("Insulina", 8, (p) => (p.insulina ? "Sim" : "Não")),
    textColumn("Tabagista", 10, (p) => (p.tabagista ? "Sim" : "Não")),
    textColumn("Atividade Física", 15, (p) =>
      p.atividade_fisica ? "Sim" : "Não",
    ),
    textColumn("Fez Exame Oftalm.", 18, (p) =>
      p.fez_exame_oftalmologico ? "Sim" : "Não",
    ),
    textColumn("AV OD", 8, (p) => p.av_od ?? ""),
    textColumn("AV OE", 8, (p) => p.av_oe ?? ""),
    textColumn("Observações", 30, (p) => p.outras_obs ?? ""),
    textColumn("Cadastrado em", 14, (p) =>
      new Date(p.created_at).toLocaleDateString("pt-BR"),
    ),
  ];

  await writeXlsxFile(pacientes, {
    columns,
    sheet: "Pacientes",
  }).toFile(`pacientes_${todayFileDate()}.xlsx`);
}

export async function exportarLaudos(laudos: LaudoExport[]) {
  const columns: Column<LaudoExport>[] = [
    textColumn("Paciente", 35, (l) => l.pacientes?.nome_completo ?? ""),
    textColumn("Resultado", 40, (l) => l.resultado_rd ?? ""),
    textColumn("Laudador", 20, (l) => l.profiles?.full_name ?? ""),
    textColumn("Data do Laudo", 14, (l) => dateOrEmpty(l.data_laudo)),
    textColumn("Dilatação", 10, (l) => l.dilatacao ?? ""),
    textColumn("Descrição", 50, (l) => l.descricao ?? ""),
    textColumn("Registrado em", 14, (l) =>
      new Date(l.created_at).toLocaleDateString("pt-BR"),
    ),
  ];

  await writeXlsxFile(laudos, {
    columns,
    sheet: "Laudos",
  }).toFile(`laudos_${todayFileDate()}.xlsx`);
}

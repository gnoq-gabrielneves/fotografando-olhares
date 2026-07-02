import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  CheckCircle2,
  ClipboardList,
  FileText,
  ListChecks,
} from "lucide-react";
import type { PacienteStatusOperacional, ResultadoRD } from "@/shared/types";

export const RD_POSITIVE_RESULTS = [
  "Retinopatia diabética não proliferativa",
  "Retinopatia diabética proliferativa",
] as const satisfies readonly ResultadoRD[];

export const ACTIVE_PENDING_PATIENT_STATUSES = [
  "cadastrado",
  "imagem_capturada",
  "aguardando_laudo",
  "encaminhado",
] as const satisfies readonly PacienteStatusOperacional[];

export function isActivePendingPatientStatus(
  status: PacienteStatusOperacional,
) {
  return (ACTIVE_PENDING_PATIENT_STATUSES as readonly PacienteStatusOperacional[])
    .includes(status);
}

export type TrainingWorkflow = {
  title: string;
  icon: LucideIcon;
  items: string[];
};

export type TrainingFormula = {
  name: string;
  icon: LucideIcon;
  value: string;
};

export const PATIENT_STATUS_DESCRIPTIONS: Record<
  PacienteStatusOperacional,
  string
> = {
  cadastrado:
    "Paciente recém-inserido no sistema, antes de entrar na fila de imagem ou laudo.",
  imagem_capturada:
    "Retinografia já realizada. Use quando a imagem existe, mas o laudo ainda não foi concluído.",
  aguardando_laudo:
    "Paciente pendente de avaliação pelo laudador. É o principal status da fila de laudos.",
  laudado:
    "Paciente com pelo menos um laudo registrado. O sistema aplica esse status automaticamente ao emitir laudo.",
  encaminhado:
    "Paciente que precisa de acompanhamento externo, retorno, especialista ou conduta posterior.",
  resolvido:
    "Caso concluído operacionalmente, sem pendências ativas no fluxo do projeto.",
};

export const TRAINING_WORKFLOWS: TrainingWorkflow[] = [
  {
    title: "Cadastro e triagem",
    icon: ClipboardList,
    items: [
      "Cadastre o paciente com nome, sexo, data de nascimento, local e dados clínicos disponíveis.",
      "Use o campo de status para posicionar o paciente na esteira clínica.",
      "Pacientes importados sem laudo ficam em Aguardando laudo.",
    ],
  },
  {
    title: "Emissão de laudo",
    icon: FileText,
    items: [
      "Abra o paciente ou use o ícone de laudo na lista de pacientes.",
      "Informe resultado, data, dilatação e descrição clínica.",
      "Ao salvar o laudo, o paciente passa automaticamente para Laudado.",
    ],
  },
  {
    title: "Acompanhamento",
    icon: ListChecks,
    items: [
      "Use filtros de status em Pacientes para localizar pendências.",
      "Use Relatórios para acompanhar distribuição da esteira e tempo médio até laudo.",
      "Use Encaminhado e Resolvido para controlar ações posteriores ao laudo.",
    ],
  },
];

export const TRAINING_FORMULAS: TrainingFormula[] = [
  {
    name: "Total de pacientes",
    icon: Calculator,
    value: "Contagem de registros da tabela de pacientes na organização atual.",
  },
  {
    name: "Laudos emitidos",
    icon: Calculator,
    value: "Contagem de registros de laudos na organização atual.",
  },
  {
    name: "Pendentes de laudo",
    icon: Calculator,
    value: "Pacientes sem laudo registrado ou em status operacional pendente.",
  },
  {
    name: "Casos com RD",
    icon: CheckCircle2,
    value:
      "Laudos com resultado Retinopatia diabética não proliferativa ou Retinopatia diabética proliferativa.",
  },
  {
    name: "Tempo médio até laudo",
    icon: Calculator,
    value:
      "Média de dias entre o cadastro do paciente e o primeiro laudo registrado no sistema.",
  },
  {
    name: "Percentuais dos gráficos",
    icon: Calculator,
    value:
      "Valor da categoria dividido pelo total do recorte, arredondado para número inteiro.",
  },
];

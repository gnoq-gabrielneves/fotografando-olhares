import type { PacienteStatusOperacional } from "@/shared/types";

export const pacienteStatusLabel: Record<PacienteStatusOperacional, string> = {
  cadastrado: "Cadastrado",
  imagem_capturada: "Imagem capturada",
  aguardando_laudo: "Aguardando laudo",
  laudado: "Laudado",
  encaminhado: "Encaminhado",
  resolvido: "Resolvido",
};

export const pacienteStatusBadge: Record<PacienteStatusOperacional, string> = {
  cadastrado: "bg-slate-100 text-slate-600 border-slate-200",
  imagem_capturada: "bg-cyan-50 text-cyan-700 border-cyan-200",
  aguardando_laudo: "bg-amber-50 text-amber-700 border-amber-200",
  laudado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  encaminhado: "bg-violet-50 text-violet-700 border-violet-200",
  resolvido: "bg-blue-50 text-blue-700 border-blue-200",
};

export function getPacienteStatusLabel(status: PacienteStatusOperacional) {
  return pacienteStatusLabel[status];
}

export function getPacienteStatusBadge(status: PacienteStatusOperacional) {
  return pacienteStatusBadge[status];
}

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  FilePlus,
  FileText,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";

export type ActivityActionConfig = {
  icon: LucideIcon;
  label: string;
  color: string;
  bg: string;
  border: string;
  text: string;
};

export const ACTIVITY_ACTION_OPTIONS = [
  { value: "todos", label: "Todas as ações" },
  { value: "paciente_criado", label: "Paciente cadastrado" },
  { value: "paciente_editado", label: "Paciente editado" },
  { value: "paciente_excluido", label: "Paciente excluído" },
  { value: "laudo_criado", label: "Laudo emitido" },
  { value: "laudo_editado", label: "Laudo editado" },
  { value: "usuario_criado", label: "Usuário criado" },
] as const;

export const activityActionFallback: ActivityActionConfig = {
  icon: Activity,
  label: "Ação",
  color: "text-slate-500",
  bg: "bg-slate-100",
  border: "border-slate-200",
  text: "text-slate-600",
};

export const activityActionConfig: Record<string, ActivityActionConfig> = {
  paciente_criado: {
    icon: UserPlus,
    label: "Paciente cadastrado",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
  },
  paciente_editado: {
    icon: Pencil,
    label: "Paciente editado",
    color: "text-slate-500",
    bg: "bg-slate-100",
    border: "border-slate-200",
    text: "text-slate-600",
  },
  paciente_excluido: {
    icon: Trash2,
    label: "Paciente excluído",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
  },
  laudo_criado: {
    icon: FilePlus,
    label: "Laudo emitido",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
  },
  laudo_editado: {
    icon: Pencil,
    label: "Laudo editado",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
  },
  usuario_criado: {
    icon: FileText,
    label: "Usuário criado",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
};

export function getActivityActionConfig(action: string) {
  return activityActionConfig[action] ?? activityActionFallback;
}

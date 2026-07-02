import { ResultadoRD } from "@/shared/types";

export const resultadoBadge: Record<ResultadoRD, string> = {
  "Exame de retinografia normal":
    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Retinopatia diabética não proliferativa":
    "bg-amber-50 text-amber-800 border border-amber-300",
  "Retinopatia diabética proliferativa":
    "bg-rose-50 text-rose-700 border border-rose-200",
  "Retinopatia hipertensiva":
    "bg-sky-50 text-sky-700 border border-sky-200",
  "Outras alterações":
    "bg-violet-50 text-violet-700 border border-violet-200",
  "Qualidade da imagem ruim":
    "bg-slate-100 text-slate-600 border border-slate-200",
};

export const resultadoChartColor: Record<string, string> = {
  "Exame de retinografia normal": "#059669",
  "Retinopatia diabética não proliferativa": "#d97706",
  "Retinopatia diabética proliferativa": "#e11d48",
  "Retinopatia hipertensiva": "#0284c7",
  "Outras alterações": "#7c3aed",
  "Qualidade da imagem ruim": "#64748b",
  "Sem RD": "#059669",
  "Não proliferativa": "#d97706",
  Proliferativa: "#e11d48",
  "Outra patologia": "#7c3aed",
};

export const resultadoProgressColor: Record<string, string> = {
  "Exame de retinografia normal": "bg-emerald-500",
  "Retinopatia diabética não proliferativa": "bg-amber-500",
  "Retinopatia diabética proliferativa": "bg-rose-500",
  "Retinopatia hipertensiva": "bg-sky-500",
  "Outras alterações": "bg-violet-500",
  "Qualidade da imagem ruim": "bg-slate-500",
  "Sem RD": "bg-emerald-500",
  "Não proliferativa": "bg-amber-500",
  Proliferativa: "bg-rose-500",
  "Outra patologia": "bg-violet-500",
};

export function getResultadoChartColor(resultado: string) {
  return resultadoChartColor[resultado] ?? "#64748b";
}

export function getResultadoProgressColor(resultado: string) {
  return resultadoProgressColor[resultado] ?? "bg-slate-500";
}

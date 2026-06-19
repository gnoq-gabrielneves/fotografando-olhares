import { ResultadoRD } from "@/types";

export const resultadoBadge: Record<ResultadoRD, string> = {
  "Exame de retinografia normal":
    "bg-cyan-50 text-cyan-700 border border-cyan-200",
  "Retinopatia diabética não proliferativa":
    "bg-amber-50 text-amber-700 border border-amber-200",
  "Retinopatia diabética proliferativa":
    "bg-red-50 text-red-700 border border-red-200",
  "Retinopatia hipertensiva":
    "bg-orange-50 text-orange-700 border border-orange-200",
  "Outras alterações":
    "bg-violet-50 text-violet-700 border border-violet-200",
  "Qualidade da imagem ruim":
    "bg-slate-100 text-slate-600 border border-slate-200",
};

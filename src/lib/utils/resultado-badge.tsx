import { ResultadoRD } from "@/types";

export const resultadoBadge: Record<ResultadoRD, string> = {
  "Exame de retinografia normal":
    "bg-cyan-950 text-cyan-400 border border-cyan-900/50",
  "Retinopatia diabética não proliferativa":
    "bg-amber-950 text-amber-400 border border-amber-900/50",
  "Retinopatia diabética proliferativa":
    "bg-red-950 text-red-400 border border-red-900/50",
  "Retinopatia hipertensiva":
    "bg-orange-950 text-orange-400 border border-orange-900/50",
  "Outras alterações":
    "bg-violet-950 text-violet-400 border border-violet-900/50",
  "Qualidade da imagem ruim":
    "bg-slate-800 text-slate-400 border border-slate-700",
};

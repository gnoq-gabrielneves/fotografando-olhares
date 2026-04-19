"use client";
import { Button } from "@/components/ui/button";
import { LaudoComLaudador } from "@/types";
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const resultadoBadge: Record<string, string> = {
  "Sem RD": "bg-cyan-950 text-cyan-400 border border-cyan-900/50",
  "Não proliferativa": "bg-amber-950 text-amber-400 border border-amber-900/50",
  Proliferativa: "bg-red-950 text-red-400 border border-red-900/50",
  "Outra patologia":
    "bg-violet-950 text-violet-400 border border-violet-900/50",
};

type Props = {
  laudos: LaudoComLaudador[];
  pacienteId: string;
};

export function PacienteLaudos({ laudos, pacienteId }: Props) {
  const router = useRouter();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-medium text-cyan-500 uppercase tracking-wider">
          Histórico de laudos
        </h2>
        <Button
          onClick={() => router.push(`/pacientes/${pacienteId}/laudo`)}
          size="sm"
          className="gap-2 bg-cyan-600 hover:bg-cyan-500 text-white h-8 text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Novo laudo
        </Button>
      </div>

      {laudos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
            <FileText className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-slate-500 text-sm">Nenhum laudo registrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {laudos.map((laudo) => (
            <div
              key={laudo.id}
              className="border border-slate-800 rounded-lg p-4 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  {laudo.resultado_rd ? (
                    <span
                      className={`text-xs px-2.5 py-1 rounded-md font-medium border ${resultadoBadge[laudo.resultado_rd] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}
                    >
                      {laudo.resultado_rd}
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-slate-800 text-slate-500 border border-slate-700">
                      Sem resultado
                    </span>
                  )}
                  {laudo.dilatacao && (
                    <span className="text-xs text-slate-500">
                      Dilatação: {laudo.dilatacao}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  {laudo.profiles?.full_name && (
                    <span>{laudo.profiles.full_name}</span>
                  )}
                  {laudo.data_laudo && (
                    <>
                      <span className="text-slate-700">·</span>
                      <span>
                        {new Date(laudo.data_laudo).toLocaleDateString("pt-BR")}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {laudo.descricao && (
                <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-3">
                  {laudo.descricao}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";
import { queryKeys } from "@/lib/query/keys";
import { PacienteResumo } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUltimosPacientes } from "../queries/queries-home";

const resultadoBadge: Record<string, { label: string; className: string }> = {
  "Sem RD": {
    label: "Sem RD",
    className: "bg-cyan-950 text-cyan-400 border border-cyan-900/50",
  },
  "Não proliferativa": {
    label: "Não proliferativa",
    className: "bg-amber-950 text-amber-400 border border-amber-900/50",
  },
  Proliferativa: {
    label: "Proliferativa",
    className: "bg-red-950 text-red-400 border border-red-900/50",
  },
  "Outra patologia": {
    label: "Outra patologia",
    className: "bg-violet-950 text-violet-400 border border-violet-900/50",
  },
};

export function UltimosPacientes() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.home.ultimosPacientes,
    queryFn: getUltimosPacientes,
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-medium text-sm">
          Últimos pacientes cadastrados
        </h2>
        <button
          onClick={() => router.push("/pacientes")}
          className="text-xs text-cyan-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
        >
          Ver todos
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-slate-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {data?.map((paciente: PacienteResumo) => {
            const resultado = paciente.laudos?.[0]?.resultado_rd;
            const badge = resultado ? resultadoBadge[resultado] : null;
            const local = paciente.locais_atendimento?.[0]?.nome ?? "—";
            const extensionista = paciente.profiles?.[0]?.full_name ?? "—";

            return (
              <button
                key={paciente.id}
                onClick={() => router.push(`/pacientes/${paciente.id}`)}
                className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-800 transition-colors group"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm text-white font-medium">
                    {paciente.nome_completo}
                  </span>
                  <span className="text-xs text-slate-500">
                    {local} · {extensionista}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {badge ? (
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-md font-medium bg-slate-800 text-slate-500 border border-slate-700">
                      Sem laudo
                    </span>
                  )}
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

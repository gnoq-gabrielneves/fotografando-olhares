"use client";
import { queryKeys } from "@/lib/query/keys";
import { resultadoBadge } from "@/lib/utils/resultado-badge";
import { PacienteResumo, ResultadoRD } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUltimosPacientes } from "../queries/queries-home";

export function UltimosPacientes() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.home.ultimosPacientes,
    queryFn: getUltimosPacientes,
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-medium text-slate-700">Últimos cadastrados</h2>
        </div>
        <button
          onClick={() => router.push("/pacientes")}
          className="text-xs text-cyan-600 hover:text-cyan-500 flex items-center gap-1 transition-colors font-medium"
        >
          Ver todos
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-11 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !data?.length ? (
          <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
            Nenhum paciente cadastrado
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {data.map((paciente: PacienteResumo) => {
              const resultado = paciente.laudos?.[0]?.resultado_rd;
              const local = (Array.isArray(paciente.locais_atendimento)
                ? paciente.locais_atendimento[0]
                : paciente.locais_atendimento
              )?.nome ?? "—";

              return (
                <button
                  key={paciente.id}
                  onClick={() => router.push(`/pacientes/${paciente.id}`)}
                  className="w-full flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors group text-left"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {paciente.nome_completo}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{local}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {resultado ? (
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium border ${resultadoBadge[resultado as ResultadoRD] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {resultado}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-orange-50 text-orange-600 border border-orange-200">
                        Sem laudo
                      </span>
                    )}
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

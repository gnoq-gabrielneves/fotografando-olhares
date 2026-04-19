"use client";
import { LaudoForm } from "@/features/pacientes/components/Laudos/LaudoForm";
import { getPacienteById } from "@/features/pacientes/queries/queries-pacientes";
import { queryKeys } from "@/lib/query/keys";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function NovoLaudoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: paciente, isLoading } = useQuery({
    queryKey: queryKeys.pacientes.byId(id),
    queryFn: () => getPacienteById(id),
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <button
          onClick={() => router.push(`/pacientes/${id}`)}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o paciente
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-800/50 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Novo laudo</h1>
            {isLoading ? (
              <div className="h-3.5 w-40 bg-slate-800 rounded animate-pulse mt-1" />
            ) : (
              <p className="text-slate-400 text-sm">
                {paciente?.nome_completo}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <LaudoForm pacienteId={id} />
      </div>
    </div>
  );
}

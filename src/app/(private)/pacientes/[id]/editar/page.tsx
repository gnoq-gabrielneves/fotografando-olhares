"use client";

import { EditarPacienteForm } from "@/features/pacientes/components/EditarPaciente/editar-paciente-form";
import { getPacienteById } from "@/features/pacientes/services/pacientes.services";
import { queryKeys } from "@/shared/lib/query/keys";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import { PacienteDetalhado } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, UserPen } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function EditarPacientePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.pacientes.byId(id),
    queryFn: () => getPacienteById(id),
  });

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <button
          onClick={() => router.push(`/pacientes/${id}`)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o paciente
        </button>

        <PageHeader
          icon={UserPen}
          title="Editar paciente"
          description={
            isLoading ? (
              <span className="block h-3.5 w-40 animate-pulse rounded bg-slate-100" />
            ) : (
              formatDisplayTextOrDash(data?.nome_completo)
            )
          }
        />
      </div>

      {/* Formulário */}
      <div className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 rounded-md" />
            ))}
          </div>
        ) : data ? (
          <EditarPacienteForm paciente={data as unknown as PacienteDetalhado} />
        ) : (
          <p className="text-slate-400 text-sm">Paciente não encontrado.</p>
        )}
      </div>
    </div>
  );
}

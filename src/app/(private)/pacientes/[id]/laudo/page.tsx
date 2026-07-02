"use client";

import { LaudoForm } from "@/features/pacientes/components/Laudos/LaudoForm";
import { getPacienteById } from "@/features/pacientes/services/pacientes.services";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import { queryKeys } from "@/shared/lib/query/keys";
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
      <div className="space-y-4">
        <button
          onClick={() => router.push(`/pacientes/${id}`)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o paciente
        </button>

        <PageHeader
          icon={Eye}
          title="Novo laudo"
          description={
            isLoading ? (
              <span className="block h-3.5 w-40 animate-pulse rounded bg-slate-100" />
            ) : (
              formatDisplayTextOrDash(paciente?.nome_completo)
            )
          }
        />
      </div>

      {/* Formulário */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <LaudoForm pacienteId={id} />
      </div>
    </div>
  );
}

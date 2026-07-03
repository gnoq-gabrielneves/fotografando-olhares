"use client";

import { LaudoForm } from "@/features/pacientes/components/Laudos/LaudoForm";
import { getPacienteById } from "@/features/pacientes/services/pacientes.services";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import { useEnabledClinicalModule } from "@/shared/hooks/use-enabled-clinical-module";
import { queryKeys } from "@/shared/lib/query/keys";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, LockKeyhole } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function NovoLaudoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: paciente, isLoading } = useQuery({
    queryKey: queryKeys.pacientes.byId(id),
    queryFn: () => getPacienteById(id),
  });
  const { isEnabled: hasOftalmo, isLoading: isLoadingModules } =
    useEnabledClinicalModule("oftalmo");

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

      {isLoadingModules ? (
        <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" />
      ) : hasOftalmo ? (
        <div className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <LaudoForm pacienteId={id} />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
            <LockKeyhole className="size-5" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-800">
            Módulo de oftalmologia indisponível
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Laudos oftalmológicos só ficam disponíveis para organizações com a
            licença de oftalmo ativa.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5"
            onClick={() => router.push(`/pacientes/${id}`)}
          >
            Voltar para o paciente
          </Button>
        </div>
      )}
    </div>
  );
}

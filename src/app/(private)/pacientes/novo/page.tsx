"use client";

import { NovoPacienteForm } from "@/features/pacientes/components/NovoPacienteForm";
import { getPacientesReturnUrl } from "@/features/pacientes/lib/pacientes-return-url";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NovoPacientePage() {
  const router = useRouter();

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <button
          onClick={() => router.push(getPacientesReturnUrl())}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para pacientes
        </button>

        <PageHeader
          icon={UserPlus}
          title="Novo paciente"
          description="Preencha os dados para cadastrar um paciente"
        />
      </div>

      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <NovoPacienteForm onSuccess={() => router.push(getPacientesReturnUrl())} />
      </div>
    </div>
  );
}

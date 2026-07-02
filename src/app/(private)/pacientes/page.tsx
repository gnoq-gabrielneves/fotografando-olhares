import type { Metadata } from "next";
import { Suspense } from "react";
import { ExportarButton } from "@/shared/components/ExportarButton/ExportarButton";
import { NovoPacienteSheet } from "@/features/pacientes/components/NovoPacienteSheet";
import { PacientesTabela } from "@/features/pacientes/components/PacientesTabela";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Pacientes | Fotografando Olhares",
  description: "Cadastro e acompanhamento dos pacientes triados pelo projeto.",
};

export default function PacientesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Pacientes"
        description="Gerencie os pacientes cadastrados no projeto"
        actions={
          <>
          <ExportarButton />
          <NovoPacienteSheet />
          </>
        }
      />
      <Suspense>
        <PacientesTabela />
      </Suspense>
    </div>
  );
}

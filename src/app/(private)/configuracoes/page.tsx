import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { ClinicalSettingsForm } from "@/features/configuracoes/components/ClinicalSettingsForm";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";

export const metadata: Metadata = {
  title: "Configurações | Fotografando Olhares",
  description: "Configurações clínicas e identidade de emissão dos documentos.",
};

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Settings}
        title="Configurações"
        description="Identidade clínica e emissão de documentos"
      />
      <ClinicalSettingsForm />
    </div>
  );
}


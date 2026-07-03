import { ExportarButton } from "@/shared/components/ExportarButton/ExportarButton";
import { LaudosTabela } from "@/features/laudos/components/LaudosTabela";
import { ModuleGate } from "@/shared/components/ModuleGate/ModuleGate";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laudos | Fotografando Olhares",
  description: "Laudos oftalmológicos emitidos no projeto de rastreamento de retinopatia diabética.",
};

export default function LaudosPage() {
  return (
    <ModuleGate moduleId="oftalmo">
      <div className="space-y-6">
        <PageHeader
          icon={FileText}
          title="Laudos"
          description="Gerencie os laudos oftalmológicos emitidos"
          actions={<ExportarButton />}
        />
        <LaudosTabela />
      </div>
    </ModuleGate>
  );
}

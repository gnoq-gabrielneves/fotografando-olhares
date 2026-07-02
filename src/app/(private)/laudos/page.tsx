import { ExportarButton } from "@/shared/components/ExportarButton/ExportarButton";
import { LaudosTabela } from "@/features/laudos/components/LaudosTabela";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laudos | Fotografando Olhares",
  description: "Laudos oftalmológicos emitidos no projeto de rastreamento de retinopatia diabética.",
};

export default function LaudosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Laudos"
        description="Gerencie os laudos oftalmológicos emitidos"
        actions={<ExportarButton />}
      />
      <LaudosTabela />
    </div>
  );
}

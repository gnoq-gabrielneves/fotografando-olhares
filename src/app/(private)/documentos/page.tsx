import type { Metadata } from "next";
import { ClipboardPlus } from "lucide-react";
import { DocumentosLista } from "@/features/documentos/components/DocumentosLista";
import { NovoDocumentoDialog } from "@/features/documentos/components/NovoDocumentoDialog";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";

export const metadata: Metadata = {
  title: "Documentos | Fotografando Olhares",
  description: "Solicitações de exames e receitas brancas.",
};

export default function DocumentosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardPlus}
        title="Documentos"
        description="Solicitações de exames e receitas brancas"
        actions={<NovoDocumentoDialog />}
      />
      <DocumentosLista />
    </div>
  );
}

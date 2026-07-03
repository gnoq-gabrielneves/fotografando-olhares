import type { Metadata } from "next";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { TrainingKnowledgeBase } from "@/features/treinamento/components/TrainingKnowledgeBase";
import { activeClinicalModule } from "@/shared/lib/modules/clinical-modules";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Treinamento | Fotografando Olhares",
  description: "Documentação operacional do sistema Fotografando Olhares.",
};

export default function TreinamentoPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookOpen}
        title="Treinamento"
        description="Documentação operacional e memórias de cálculo do sistema"
        meta={
          <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 ring-1 ring-cyan-100">
            Módulo {activeClinicalModule.name}
          </span>
        }
      />

      <TrainingKnowledgeBase />
    </div>
  );
}

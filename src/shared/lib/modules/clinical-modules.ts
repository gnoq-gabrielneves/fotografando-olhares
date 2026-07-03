import { ClipboardPlus, Eye, type LucideIcon } from "lucide-react";

export const CLINICAL_MODULE_IDS = ["documentos", "oftalmo"] as const;
export type ClinicalModuleId = (typeof CLINICAL_MODULE_IDS)[number];

export type ClinicalModule = {
  id: ClinicalModuleId;
  name: string;
  specialty: string;
  description: string;
  vocabulary: {
    exam: string;
    document: string;
    result: string;
    pendingDocument: string;
    positiveFinding: string;
  };
  icon: LucideIcon;
  licenseStatusLabel: string;
  freeByDefault?: boolean;
};

export const clinicalModules: Record<ClinicalModuleId, ClinicalModule> = {
  documentos: {
    id: "documentos",
    name: "Documentos clínicos",
    specialty: "Documentos gerais",
    description:
      "Solicitação de exames e emissão de receitas brancas simples para fluxos clínicos gerais.",
    vocabulary: {
      exam: "Solicitação de exame",
      document: "Receita branca",
      result: "Documento emitido",
      pendingDocument: "Documento pendente",
      positiveFinding: "Documento assinado",
    },
    icon: ClipboardPlus,
    licenseStatusLabel: "Gratuito para todos os clientes",
    freeByDefault: true,
  },
  oftalmo: {
    id: "oftalmo",
    name: "Oftalmo",
    specialty: "Oftalmologia",
    description:
      "Triagem oftalmológica, retinografia, acompanhamento de laudos e indicadores de retinopatia.",
    vocabulary: {
      exam: "Retinografia",
      document: "Laudo",
      result: "Resultado da RD",
      pendingDocument: "Pendente de laudo",
      positiveFinding: "Caso com RD",
    },
    icon: Eye,
    licenseStatusLabel: "Incluído na licença atual",
  },
};

export const activeClinicalModule = clinicalModules.oftalmo;

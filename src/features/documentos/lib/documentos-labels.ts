import type {
  DocumentoClinicoStatus,
  DocumentoClinicoType,
} from "@/shared/types";

export const documentoTipoLabel: Record<DocumentoClinicoType, string> = {
  exam_request: "Solicitação de exame",
  white_prescription: "Receita branca",
};

export const documentoStatusLabel: Record<DocumentoClinicoStatus, string> = {
  draft: "Rascunho",
  issued: "Emitido",
  cancelled: "Cancelado",
};

export const documentoStatusBadge: Record<DocumentoClinicoStatus, string> = {
  draft: "border-slate-200 bg-slate-100 text-slate-600",
  issued: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

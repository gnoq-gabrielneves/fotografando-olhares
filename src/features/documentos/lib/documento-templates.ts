import type { DocumentoClinicoType } from "@/shared/types";

export type DocumentoTemplate = {
  title: string;
  content: string;
};

export const documentoTemplates: Record<DocumentoClinicoType, DocumentoTemplate> = {
  exam_request: {
    title: "Solicitação de exames",
    content: `Solicito a realização dos seguintes exames:
- 

Indicação clínica:

Orientações ao paciente:
- Levar documento de identificação.
- Apresentar esta solicitação no local de realização do exame.
`,
  },
  white_prescription: {
    title: "Receita branca",
    content: `Prescrevo:
1. 

Modo de uso:

Orientações:
- Seguir a prescrição conforme orientação profissional.
- Retornar em caso de piora, reação adversa ou dúvidas.
`,
  },
};

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  ClipboardPlus,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export type DevblogPost = {
  version: string;
  date: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  tags: string[];
  highlights: string[];
  details: Array<{
    title: string;
    items: string[];
  }>;
};

export const devblogPosts: DevblogPost[] = [
  {
    version: "0.4.0",
    date: "2026-07-03",
    title: "Base modular para licenças clínicas",
    summary:
      "O sistema começou a sair de um fluxo exclusivamente oftalmológico para uma base preparada para múltiplas áreas da medicina.",
    icon: Building2,
    tags: ["Plataforma", "Licenças", "Módulos"],
    highlights: [
      "Organizações agora podem ter módulos clínicos ativos ou inativos.",
      "Usuário desenvolvedor pode alternar a organização atual.",
      "Itens indisponíveis aparecem sinalizados para desenvolvedores.",
    ],
    details: [
      {
        title: "Para operação",
        items: [
          "O cadastro de pacientes fica básico quando a licença de oftalmo não está ativa.",
          "Laudos, status de esteira e campos oftalmológicos aparecem apenas com o módulo Oftalmo.",
          "Documentos clínicos entram como módulo gratuito para solicitações e receitas simples.",
        ],
      },
      {
        title: "Para administração",
        items: [
          "Foi criada a área de licenças para atribuir módulos por organização.",
          "A organização pode ser criada e editada pela área de desenvolvedor.",
          "As permissões passaram a considerar o papel developer para gestão de plataforma.",
        ],
      },
    ],
  },
  {
    version: "0.3.0",
    date: "2026-07-03",
    title: "Documentos clínicos com preview",
    summary:
      "Nova área para emitir documentos simples, com visualização antes de baixar ou imprimir.",
    icon: ClipboardPlus,
    tags: ["Documentos", "Receitas", "Exames"],
    highlights: [
      "Criação de solicitação de exame e receita branca.",
      "Preview do documento em formato de folha.",
      "Ações separadas para visualizar, baixar e imprimir.",
    ],
    details: [
      {
        title: "Incluído",
        items: [
          "Lista de documentos emitidos por organização.",
          "Vínculo opcional com paciente.",
          "Histórico de emissão com responsável pelo documento.",
        ],
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-07-02",
    title: "Experiência de pacientes reorganizada",
    summary:
      "A visualização do paciente ficou mais escaneável e os fluxos de paciente foram padronizados em páginas.",
    icon: Users,
    tags: ["Pacientes", "UX", "Páginas"],
    highlights: [
      "Detalhe do paciente ganhou cabeçalho com resumo e cards organizados.",
      "Novo paciente, editar paciente e novo laudo agora usam páginas full-width.",
      "Datas civis deixaram de sofrer deslocamento por fuso horário.",
    ],
    details: [
      {
        title: "Melhorias visuais",
        items: [
          "Dados pessoais, atendimento, hábitos e oftalmologia foram separados em cards.",
          "Histórico de laudos ficou mais legível.",
          "Estados vazios e skeletons foram refinados.",
        ],
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-07-02",
    title: "Primeiro polimento de produto",
    summary:
      "Primeira rodada para deixar o sistema com cara de produto: headers, sidebar, status e documentação.",
    icon: Sparkles,
    tags: ["Produto", "Interface", "Treinamento"],
    highlights: [
      "Headers foram padronizados seguindo o visual da página de relatórios.",
      "Sidebar ganhou agrupamentos por contexto.",
      "Treinamento foi adicionado com explicação de status e memórias de cálculo.",
    ],
    details: [
      {
        title: "Também entrou",
        items: [
          "Padronização visual de nomes e textos com capitalização consistente.",
          "Melhorias nos gráficos da home e relatórios.",
          "Sinais visuais de carregando, salvando e alterações pendentes em formulários.",
        ],
      },
    ],
  },
];

export const devblogStats = [
  {
    label: "Versões registradas",
    value: String(devblogPosts.length),
    icon: FileText,
  },
  {
    label: "Área atual",
    value: "Produto",
    icon: LayoutDashboard,
  },
  {
    label: "Governança",
    value: "Interno",
    icon: ShieldCheck,
  },
  {
    label: "Uso",
    value: "Treinamento",
    icon: BookOpen,
  },
];

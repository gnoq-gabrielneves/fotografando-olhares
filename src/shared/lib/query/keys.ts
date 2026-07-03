export const queryKeys = {
  profile: {
    all: ["profile"] as const,
    byId: (id: string) => ["profile", id] as const,
  },
  pacientes: {
    all: ["pacientes"] as const,
    lista: (filtros: object) => ["pacientes", "lista", filtros] as const,
    byId: (id: string) => ["pacientes", id] as const,
  },
  laudos: {
    all: ["laudos"] as const,
    lista: (filtros: object) => ["laudos", "lista", filtros] as const,
    byPaciente: (pacienteId: string) => ["laudos", pacienteId] as const,
    byId: (id: string) => ["laudos", "detalhe", id] as const,
  },
  documentos: {
    all: ["documentos"] as const,
    lista: ["documentos", "lista"] as const,
    pacientes: ["documentos", "pacientes"] as const,
  },
  home: {
    metricas: ["home", "metricas"] as const,
    distribuicaoRD: ["home", "distribuicaoRD"] as const,
    distribuicaoPorLocal: ["home", "distribuicaoPorLocal"] as const,
    ultimosPacientes: ["home", "ultimosPacientes"] as const,
  },
  relatorios: {
    geral: ["relatorios", "geral"] as const,
    distribuicaoResultados: ["relatorios", "distribuicaoResultados"] as const,
    distribuicaoPorExtensionista: [
      "relatorios",
      "distribuicaoPorExtensionista",
    ] as const,
    laudosPorMes: ["relatorios", "laudosPorMes"] as const,
    cadastrosPorMes: ["relatorios", "cadastrosPorMes"] as const,
    distribuicaoPorLocal: ["relatorios", "distribuicaoPorLocal"] as const,
    esteiraClinica: ["relatorios", "esteiraClinica"] as const,
  },
  usuarios: {
    all: ["usuarios"] as const,
    lista: ["usuarios", "lista"] as const,
  },
  atividade: {
    recente: ["atividade", "recente"] as const,
    paginada: (filtros: object) => ["atividade", "paginada", filtros] as const,
    usuarios: ["atividade", "usuarios"] as const,
  },
  modulos: {
    organizacaoAtual: ["modulos", "organizacaoAtual"] as const,
  },
  desenvolvedor: {
    modulos: ["desenvolvedor", "modulos"] as const,
  },
};

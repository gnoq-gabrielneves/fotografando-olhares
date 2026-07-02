import { ResultadoRD } from "@/shared/types";

export type LaudoTabela = {
  id: string;
  data_laudo: string | null;
  resultado_rd: ResultadoRD | null;
  descricao: string | null;
  created_at: string;
  pacientes: { id: string; nome_completo: string } | null;
  profiles: { full_name: string } | null;
};

export type FiltrosLaudos = {
  busca?: string;
  resultado_rd?: string;
  page?: number;
  pageSize?: number;
};

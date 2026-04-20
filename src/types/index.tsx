export type Profile = {
  id: string;
  full_name: string;
  role: "admin" | "extensionista" | "laudador";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type PacienteResumo = {
  id: string;
  nome_completo: string;
  created_at: string;
  locais_atendimento: { nome: string }[] | null;
  profiles: { full_name: string }[] | null;
  laudos: { resultado_rd: string | null }[];
};

export type LocalAtendimento = {
  id: string;
  nome: string;
  created_at: string;
};

export type Paciente = {
  id: string;
  nome_completo: string;
  sexo: "M" | "F" | null;
  cpf_cns: string | null;
  data_nascimento: string | null;
  local_atendimento_id: string | null;
  prontuario: string | null;
  termo_assinado: boolean | null;
  medicamentos_em_uso: string | null;
  insulina: boolean | null;
  tempo_diagnostico_dm:
    | "<1 ano"
    | "1 a 5 anos"
    | "5 a 10 anos"
    | ">10 anos"
    | null;
  fez_exame_oftalmologico: boolean | null;
  qt_tempo_ultimo_exame: string | null;
  tabagista: boolean | null;
  atividade_fisica: boolean | null;
  av_od: string | null;
  av_oe: string | null;
  outras_obs: string | null;
  extensionista_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ResultadoRD =
  | "Retinopatia diabética não proliferativa"
  | "Retinopatia diabética proliferativa"
  | "Retinopatia hipertensiva"
  | "Outras alterações"
  | "Exame de retinografia normal"
  | "Qualidade da imagem ruim";

export type Laudo = {
  id: string;
  paciente_id: string;
  laudador_id: string | null;
  data_laudo: string | null;
  resultado_rd: ResultadoRD | null;
  descricao: string | null;
  dilatacao: string | null;
  created_at: string;
  updated_at: string;
};

export type PacienteComRelacoes = Paciente & {
  locais_atendimento: Pick<LocalAtendimento, "nome"> | null;
  profiles: Pick<Profile, "full_name"> | null;
  laudos: Pick<Laudo, "resultado_rd">[];
};

export type PacienteTabela = {
  id: string;
  nome_completo: string;
  sexo: "M" | "F" | null;
  data_nascimento: string | null;
  created_at: string;
  locais_atendimento: { nome: string } | null;
  profiles: { full_name: string } | null;
  laudos: { resultado_rd: string | null }[];
};

export type LaudoComLaudador = Laudo & {
  profiles: Pick<Profile, "full_name"> | null;
};

export type PacienteDetalhado = Paciente & {
  locais_atendimento: Pick<LocalAtendimento, "id" | "nome"> | null;
  profiles: Pick<Profile, "id" | "full_name"> | null;
  laudos: LaudoComLaudador[];
};

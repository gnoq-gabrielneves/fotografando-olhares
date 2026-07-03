export const ORGANIZATION_STATUSES = ["active", "inactive"] as const;
export type OrganizationStatus = (typeof ORGANIZATION_STATUSES)[number];
export const MODULE_STATUSES = ["active", "inactive"] as const;
export type ModuleStatus = (typeof MODULE_STATUSES)[number];

export type Organization = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  status: OrganizationStatus;
  created_at: string;
  updated_at: string;
};

export type ClinicalModule = {
  id: string;
  name: string;
  specialty: string;
  description: string | null;
  status: ModuleStatus;
  created_at: string;
  updated_at: string;
};

export type OrganizationModule = {
  organization_id: string;
  module_id: string;
  status: ModuleStatus;
  enabled_at: string;
  created_at: string;
  updated_at: string;
  clinical_modules?: Pick<
    ClinicalModule,
    "id" | "name" | "specialty" | "description" | "status"
  > | null;
};

export const USER_ROLES = [
  "developer",
  "admin",
  "extensionista",
  "laudador",
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export type Profile = {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  organization_id?: string;
  organizations?: Pick<Organization, "id" | "name" | "slug" | "logo_url"> | null;
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
  organization_id?: string;
  created_at: string;
};

export type Sexo = "M" | "F";
export type Zona = "Urbana" | "Rural" | "Periurbana";
export type TempoDiagnostico = "<1 ano" | "1 a 5 anos" | "5 a 10 anos" | ">10 anos";

export const PACIENTE_STATUS_OPERACIONAIS = [
  "cadastrado",
  "imagem_capturada",
  "aguardando_laudo",
  "laudado",
  "encaminhado",
  "resolvido",
] as const;
export type PacienteStatusOperacional =
  (typeof PACIENTE_STATUS_OPERACIONAIS)[number];

export type Paciente = {
  id: string;
  nome_completo: string;
  sexo: Sexo | null;
  cpf_cns: string | null;
  data_nascimento: string | null;
  local_atendimento_id: string | null;
  prontuario: string | null;
  termo_assinado: boolean | null;
  medicamentos_em_uso: string | null;
  insulina: boolean | null;
  tempo_diagnostico_dm: TempoDiagnostico | null;
  fez_exame_oftalmologico: boolean | null;
  qt_tempo_ultimo_exame: string | null;
  tabagista: boolean | null;
  atividade_fisica: boolean | null;
  av_od: string | null;
  av_oe: string | null;
  outras_obs: string | null;
  extensionista_id: string | null;
  status_operacional: PacienteStatusOperacional;
  organization_id?: string;
  created_at: string;
  updated_at: string;
  zona: Zona | null;
  tempo_diagnostico_has: TempoDiagnostico | null;
};

export const RESULTADOS_RD = [
  "Retinopatia diabética não proliferativa",
  "Retinopatia diabética proliferativa",
  "Retinopatia hipertensiva",
  "Outras alterações",
  "Exame de retinografia normal",
  "Qualidade da imagem ruim",
] as const;

export type ResultadoRD = (typeof RESULTADOS_RD)[number];

export type Laudo = {
  id: string;
  paciente_id: string;
  laudador_id: string | null;
  organization_id?: string;
  data_laudo: string | null;
  resultado_rd: ResultadoRD | null;
  descricao: string | null;
  dilatacao: string | null;
  created_at: string;
  updated_at: string;
};

export const DOCUMENTO_CLINICO_TYPES = [
  "exam_request",
  "white_prescription",
] as const;
export type DocumentoClinicoType = (typeof DOCUMENTO_CLINICO_TYPES)[number];

export const DOCUMENTO_CLINICO_STATUSES = [
  "draft",
  "issued",
  "cancelled",
] as const;
export type DocumentoClinicoStatus =
  (typeof DOCUMENTO_CLINICO_STATUSES)[number];

export type DocumentoClinico = {
  id: string;
  organization_id: string;
  paciente_id: string | null;
  created_by: string | null;
  document_type: DocumentoClinicoType;
  title: string;
  content: string;
  status: DocumentoClinicoStatus;
  issued_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DocumentoClinicoTabela = DocumentoClinico & {
  pacientes: Pick<Paciente, "id" | "nome_completo"> | null;
  profiles: Pick<Profile, "full_name"> | null;
};

export type PacienteComRelacoes = Paciente & {
  locais_atendimento: Pick<LocalAtendimento, "nome"> | null;
  profiles: Pick<Profile, "full_name"> | null;
  laudos: Pick<Laudo, "resultado_rd">[];
};

export type PacienteTabela = {
  id: string;
  nome_completo: string;
  sexo: Sexo | null;
  data_nascimento: string | null;
  created_at: string;
  status_operacional: PacienteStatusOperacional;
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

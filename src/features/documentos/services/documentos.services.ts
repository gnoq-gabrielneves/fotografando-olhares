import { logActivity } from "@/shared/lib/activity/log-activity";
import { getCurrentOrganizationId } from "@/shared/lib/organization/current-client";
import { withOrganizationId } from "@/shared/lib/organization/scope";
import { createClient } from "@/shared/lib/supabase/client";
import type {
  DocumentoClinicoTabela,
  DocumentoClinicoType,
} from "@/shared/types";

export type NovoDocumentoInput = {
  paciente_id?: string;
  document_type: DocumentoClinicoType;
  title: string;
  content: string;
  clinical_justification?: string;
  material_to_examine?: string;
};

export type DocumentoPacienteOpcao = {
  id: string;
  nome_completo: string;
  data_nascimento: string | null;
  sexo: string | null;
  nome_mae: string | null;
  telefone: string | null;
  endereco: string | null;
};

export async function listarDocumentosClinicos(): Promise<
  DocumentoClinicoTabela[]
> {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase
    .from("clinical_documents")
    .select(
      `
      *,
      pacientes(id, nome_completo, data_nascimento, sexo, nome_mae, telefone, endereco),
      profiles!clinical_documents_created_by_fkey(full_name)
      `,
    )
    .order("created_at", { ascending: false });

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as DocumentoClinicoTabela[];
}

export async function listarPacientesParaDocumento(): Promise<
  DocumentoPacienteOpcao[]
> {
  const supabase = createClient();
  const organizationId = await getCurrentOrganizationId();

  let query = supabase
    .from("pacientes")
    .select("id, nome_completo, data_nascimento, sexo, nome_mae, telefone, endereco")
    .order("nome_completo", { ascending: true });

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query.limit(200);
  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function criarDocumentoClinico(input: NovoDocumentoInput) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado");

  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) throw new Error("Organização não encontrada");

  const title = input.title.trim();
  const content = input.content.trim();
  const { data: settings } = await supabase
    .from("clinical_settings")
    .select("*")
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (!title) throw new Error("Informe o título do documento");
  if (!content) throw new Error("Informe o conteúdo do documento");

  const { data, error } = await supabase
    .from("clinical_documents")
    .insert(
      withOrganizationId(
        {
          paciente_id: input.paciente_id || null,
          created_by: user.id,
          document_type: input.document_type,
          title,
          content,
          clinic_name: settings?.clinic_name ?? null,
          clinic_logo_url: settings?.clinic_logo_url ?? null,
          clinic_city: settings?.clinic_city ?? null,
          physician_name: settings?.physician_name ?? null,
          physician_crm: settings?.physician_crm ?? null,
          clinical_justification: input.clinical_justification?.trim() || null,
          material_to_examine: input.material_to_examine?.trim() || null,
          status: "issued",
          issued_at: new Date().toISOString(),
        },
        organizationId,
      ),
    )
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logActivity({
    user_id: user.id,
    action: "documento_criado",
    entity_type: "clinical_document",
    entity_id: data.id,
    description: `emitiu o documento ${title}`,
    organization_id: organizationId,
  });

  return data;
}

export async function excluirDocumentoClinico(documentoId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado");

  const organizationId = await getCurrentOrganizationId();
  if (!organizationId) throw new Error("Organização não encontrada");

  const { data: documento, error: documentoError } = await supabase
    .from("clinical_documents")
    .select("id, title, organization_id")
    .eq("id", documentoId)
    .eq("organization_id", organizationId)
    .single();

  if (documentoError) throw new Error(documentoError.message);

  const { error } = await supabase
    .from("clinical_documents")
    .delete()
    .eq("id", documentoId)
    .eq("organization_id", organizationId);

  if (error) throw new Error(error.message);

  await logActivity({
    user_id: user.id,
    action: "documento_excluido",
    entity_type: "clinical_document",
    entity_id: documento.id,
    description: `excluiu o documento ${documento.title}`,
    organization_id: organizationId,
  });
}

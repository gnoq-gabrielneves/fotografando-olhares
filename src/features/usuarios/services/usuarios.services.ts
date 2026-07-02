"use server";
import { logActivityServer } from "@/shared/lib/activity/log-activity-server";
import {
  getOrganizationIdFromRecord,
  withOrganizationId,
} from "@/shared/lib/organization/scope";
import { createClient } from "@/shared/lib/supabase/server";
import type { UserRole } from "@/shared/types";
import { createClient as createAdminClient } from "@supabase/supabase-js";

type CriarUsuarioInput = {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  organization_id?: string;
  avatar_url?: string;
};

type AdminProfile = {
  role?: UserRole | null;
  organization_id?: string | null;
};

export type OrganizacaoOpcao = {
  id: string;
  name: string;
  slug: string;
};

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function verificarAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const adminProfile = profile as AdminProfile | null;
  if (adminProfile?.role !== "admin" && adminProfile?.role !== "developer") {
    throw new Error("Sem permissão");
  }
  return { supabase, user, profile: adminProfile };
}

export async function criarUsuario(input: CriarUsuarioInput) {
  const { profile } = await verificarAdmin();
  const admin = getAdminClient();
  assertPodeAtribuirRole(profile, input.role);
  const organizationId = getTargetOrganizationId(profile, input.organization_id);

  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: input.full_name, role: input.role },
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Erro ao criar usuário");

  const { error: profileError } = await admin.from("profiles").upsert(
    withOrganizationId(
      {
        id: data.user.id,
        full_name: input.full_name,
        role: input.role,
        avatar_url: input.avatar_url ?? null,
      },
      organizationId,
    ),
  );

  if (profileError) throw new Error(profileError.message);

  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (currentUser) {
    await logActivityServer({
      user_id: currentUser.id,
      action: "usuario_criado",
      entity_type: "usuario",
      entity_id: data.user.id,
      description: `criou o usuário ${input.full_name} (${input.role})`,
      organization_id: organizationId,
    });
  }

  return data.user;
}

export async function listarUsuarios() {
  const { supabase, profile } = await verificarAdmin();
  const organizationId = getOrganizationIdFromRecord(profile);

  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (profile?.role !== "developer" && organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
}

export async function excluirUsuario(id: string) {
  const { user, profile } = await verificarAdmin();
  if (user.id === id)
    throw new Error("Você não pode excluir sua própria conta");

  const admin = getAdminClient();
  await assertUsuarioNaMesmaOrganizacao(admin, id, profile);

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);
}

export async function atualizarUsuario(
  id: string,
  input: {
    full_name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    organization_id?: string;
    avatar_url?: string;
  },
) {
  const { profile } = await verificarAdmin();
  const admin = getAdminClient();
  await assertUsuarioNaMesmaOrganizacao(admin, id, profile);
  if (input.role) assertPodeAtribuirRole(profile, input.role);

  if (input.email || input.password) {
    const authUpdate: { email?: string; password?: string } = {};
    if (input.email) authUpdate.email = input.email;
    if (input.password) authUpdate.password = input.password;

    const { error } = await admin.auth.admin.updateUserById(id, authUpdate);
    if (error) throw new Error(error.message);
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({
      full_name: input.full_name,
      role: input.role,
      organization_id: getTargetOrganizationId(profile, input.organization_id),
      avatar_url: input.avatar_url,
    })
    .eq("id", id);

  if (profileError) throw new Error(profileError.message);
}

export async function listarOrganizacoes(): Promise<OrganizacaoOpcao[]> {
  const { profile } = await verificarAdmin();
  if (profile?.role !== "developer") return [];

  const admin = getAdminClient();
  const { data, error } = await admin
    .from("organizations")
    .select("id, name, slug")
    .order("name");

  if (error) {
    if (error.code === "42P01" || error.message.includes("does not exist")) {
      return [];
    }
    throw new Error(error.message);
  }

  return data ?? [];
}

async function assertUsuarioNaMesmaOrganizacao(
  admin: ReturnType<typeof getAdminClient>,
  userId: string,
  adminProfile: AdminProfile | null,
) {
  const organizationId = getOrganizationIdFromRecord(adminProfile);
  if (adminProfile?.role === "developer" || !organizationId) return;

  const { data, error } = await admin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  const targetOrganizationId = getOrganizationIdFromRecord(
    data as AdminProfile | null,
  );

  if (targetOrganizationId !== organizationId) {
    throw new Error("Usuário não pertence à sua organização");
  }
}

function assertPodeAtribuirRole(profile: AdminProfile | null, role: UserRole) {
  if (role === "developer" && profile?.role !== "developer") {
    throw new Error("Apenas desenvolvedores podem atribuir esse nível de acesso");
  }
}

function getTargetOrganizationId(
  profile: AdminProfile | null,
  requestedOrganizationId?: string,
) {
  if (profile?.role === "developer") {
    return requestedOrganizationId || getOrganizationIdFromRecord(profile);
  }

  return getOrganizationIdFromRecord(profile);
}

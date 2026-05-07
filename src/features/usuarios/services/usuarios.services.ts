"use server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

type CriarUsuarioInput = {
  full_name: string;
  email: string;
  password: string;
  role: "admin" | "extensionista" | "laudador";
  avatar_url?: string;
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
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Sem permissão");
  return { supabase, user };
}

export async function criarUsuario(input: CriarUsuarioInput) {
  await verificarAdmin();
  const admin = getAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: input.full_name, role: input.role },
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Erro ao criar usuário");

  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    full_name: input.full_name,
    role: input.role,
    avatar_url: input.avatar_url ?? null,
  });

  if (profileError) throw new Error(profileError.message);
  return data.user;
}

export async function listarUsuarios() {
  const { supabase } = await verificarAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function excluirUsuario(id: string) {
  const { user } = await verificarAdmin();
  if (user.id === id)
    throw new Error("Você não pode excluir sua própria conta");

  const admin = getAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);
}

export async function atualizarUsuario(
  id: string,
  input: {
    full_name?: string;
    email?: string;
    password?: string;
    role?: "admin" | "extensionista" | "laudador";
    avatar_url?: string;
  },
) {
  const { user } = await verificarAdmin();
  const admin = getAdminClient();

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
      avatar_url: input.avatar_url,
    })
    .eq("id", id);

  if (profileError) throw new Error(profileError.message);
}

import { createClient } from "@/shared/lib/supabase/client";

export async function atualizarPerfil(input: {
  full_name?: string;
  email?: string;
  password?: string;
  avatar_url?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  if (input.email || input.password) {
    const authUpdate: { email?: string; password?: string } = {};
    if (input.email) authUpdate.email = input.email;
    if (input.password) authUpdate.password = input.password;
    const { error } = await supabase.auth.updateUser(authUpdate);
    if (error) throw new Error(error.message);
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.full_name,
      avatar_url: input.avatar_url,
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
}

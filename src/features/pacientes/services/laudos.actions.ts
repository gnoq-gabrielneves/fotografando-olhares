"use server";

import { createClient } from "@/lib/supabase/server";

export async function excluirLaudo(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado");

  const { data, error } = await supabase
    .from("laudos")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error("Laudo não encontrado.");
}

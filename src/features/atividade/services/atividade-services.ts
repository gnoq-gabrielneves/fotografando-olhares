import { createClient } from "@/lib/supabase/client";

export type AtividadeLog = {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  description: string;
  created_at: string;
  profiles: { full_name: string; avatar_url: string | null } | null;
};

export type FiltrosAtividade = {
  action?: string;
  user_id?: string;
  page?: number;
  pageSize?: number;
};

export async function getAtividadeRecente(limit = 20): Promise<AtividadeLog[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("activity_logs")
    .select(
      "id, action, entity_type, entity_id, description, created_at, profiles(full_name, avatar_url)",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data as unknown as AtividadeLog[];
}

export async function getAtividadePaginada(
  filtros: FiltrosAtividade = {},
): Promise<{ data: AtividadeLog[]; count: number }> {
  const supabase = createClient();
  const { action, user_id, page = 1, pageSize = 25 } = filtros;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("activity_logs")
    .select(
      "id, action, entity_type, entity_id, description, created_at, profiles(full_name, avatar_url)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (action && action !== "todos") {
    query = query.eq("action", action);
  }

  if (user_id && user_id !== "todos") {
    query = query.eq("user_id", user_id);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: data as unknown as AtividadeLog[],
    count: count ?? 0,
  };
}

export async function getUsuariosAtivos(): Promise<
  { id: string; full_name: string }[]
> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .order("full_name");

  if (error) throw new Error(error.message);
  return data ?? [];
}

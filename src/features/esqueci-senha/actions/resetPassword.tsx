import { createClient } from "@/lib/supabase/server";

export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/atualizar-senha`,
  });

  if (error) throw new Error(error.message);
}

"use server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function uploadAvatar(
  fileBase64: string,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error("Variáveis de ambiente não configuradas");

  const admin = createAdminClient(url, key);
  const buffer = Buffer.from(fileBase64, "base64");

  const { error } = await admin.storage.from("icons").upload(fileName, buffer, {
    contentType: mimeType,
    upsert: true,
  });

  if (error) throw new Error(error.message);

  const { data } = admin.storage.from("icons").getPublicUrl(fileName);
  return data.publicUrl;
}

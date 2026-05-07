import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function useAvatarUpload() {
  const [isUploading, setIsUploading] = useState(false);

  async function upload(file: File): Promise<string> {
    const supabase = createClient();
    setIsUploading(true);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (error) throw new Error("Erro ao fazer upload da foto");

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

      return data.publicUrl;
    } finally {
      setIsUploading(false);
    }
  }

  return { upload, isUploading };
}

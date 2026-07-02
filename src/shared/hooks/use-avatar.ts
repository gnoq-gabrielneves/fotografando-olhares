import { uploadAvatar } from "@/shared/services/avatar";
import { useState } from "react";

async function comprimirImagem(file: File, maxWidth = 400): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas não suportado"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) return reject(new Error("Erro ao comprimir imagem"));
          resolve(blob);
        },
        "image/jpeg",
        0.7,
      );
    };
    img.onerror = () => reject(new Error("Erro ao carregar imagem"));
    img.src = url;
  });
}

export function useAvatarUpload() {
  const [isUploading, setIsUploading] = useState(false);

  async function upload(file: File): Promise<string> {
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}.jpg`;
      const blob = await comprimirImagem(file);

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
        reader.readAsDataURL(blob);
      });

      return await uploadAvatar(base64, fileName, "image/jpeg");
    } finally {
      setIsUploading(false);
    }
  }

  return { upload, isUploading };
}

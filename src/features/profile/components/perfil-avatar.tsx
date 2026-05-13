/* eslint-disable @next/next/no-img-element */
"use client";
import { useAvatarUpload } from "@/hooks/use-avatar";
import { useProfile } from "@/hooks/use-profile";
import { Loader2, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { useAtualizarPerfil } from "../hooks/use-profile";

const roleLabel: Record<string, string> = {
  admin: "Administrador",
  extensionista: "Extensionista",
  laudador: "Laudador",
};

export function PerfilAvatar() {
  const { profile } = useProfile();
  const { upload, isUploading } = useAvatarUpload();
  const { mutate: atualizar, isPending } = useAtualizarPerfil();
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = profile?.full_name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const avatar_url = await upload(file);
      atualizar({ avatar_url });
    } catch {
      toast.error("Erro ao fazer upload da foto");
    }
  }

  const isLoading = isUploading || isPending;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-400 text-3xl font-medium">
              {initials}
            </span>
          )}
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shadow-md transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>
      <div className="text-center">
        <p className="text-slate-800 font-semibold text-lg">
          {profile?.full_name}
        </p>
        <p className="text-slate-500 text-sm">
          {roleLabel[profile?.role ?? ""] ?? profile?.role}
        </p>
      </div>
    </div>
  );
}

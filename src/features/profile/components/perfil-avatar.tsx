/* eslint-disable @next/next/no-img-element */
"use client";
import { useAvatarUpload } from "@/hooks/use-avatar";
import { useProfile } from "@/hooks/use-profile";
import { Camera, Loader2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { useAtualizarPerfil } from "../hooks/use-profile";

const roleLabel: Record<string, string> = {
  admin: "Administrador",
  extensionista: "Extensionista",
  laudador: "Laudador",
};

const roleBadge: Record<string, string> = {
  admin: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  extensionista: "bg-blue-50 text-blue-700 border-blue-200",
  laudador: "bg-lime-50 text-lime-700 border-lime-200",
};

export function PerfilAvatar() {
  const { profile, user } = useProfile();
  const { upload, isUploading } = useAvatarUpload();
  const { mutate: atualizar, isPending } = useAtualizarPerfil();
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = profile?.full_name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

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
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-cyan-500 to-cyan-600" />
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
          <div className="relative w-fit">
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden bg-slate-100 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url || undefined}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-500 text-2xl font-semibold">
                  {initials}
                </span>
              )}
            </div>
            <button
              onClick={() => inputRef.current?.click()}
              disabled={isLoading}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shadow-md transition-colors disabled:opacity-50 border-2 border-white"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Camera className="w-3 h-3" />
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

          <div className="pb-1">
            {profile?.role && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${roleBadge[profile.role] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
                {roleLabel[profile.role] ?? profile.role}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3">
          <h2 className="text-lg font-semibold text-slate-800">{profile?.full_name}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-0.5">
            <span className="text-sm text-slate-400">{user?.email}</span>
            {memberSince && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-sm text-slate-400">Membro desde {memberSince}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

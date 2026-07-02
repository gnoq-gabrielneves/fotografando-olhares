/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useAvatarUpload } from "@/shared/hooks/use-avatar";
import { useProfile } from "@/shared/hooks/use-profile";
import type { UserRole } from "@/shared/types";
import { Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useCriarUsuario, useOrganizacoes } from "../hooks/use-users";

type FormData = {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  organization_id: string;
};

type Props = {
  onSuccess: () => void;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-medium text-cyan-600 uppercase tracking-wider whitespace-nowrap">
        {children}
      </span>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

const inputClass =
  "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-cyan-500 h-10";
const labelClass = "text-slate-600 text-xs mb-1.5 block";
const errClass = "text-red-500 text-xs mt-1";

const roles: { value: FormData["role"]; label: string; developerOnly?: boolean }[] = [
  { value: "developer", label: "Desenvolvedor", developerOnly: true },
  { value: "extensionista", label: "Extensionista" },
  { value: "laudador", label: "Laudador" },
  { value: "admin", label: "Administrador" },
];

export function NovoUsuarioForm({ onSuccess }: Props) {
  const { profile } = useProfile();
  const isDeveloper = profile?.role === "developer";
  const { upload, isUploading } = useAvatarUpload();
  const { mutate: criar, isPending } = useCriarUsuario(onSuccess);
  const { data: organizacoes, isLoading: isLoadingOrganizacoes } =
    useOrganizacoes(isDeveloper);

  const [form, setForm] = useState<FormData>({
    full_name: "",
    email: "",
    password: "",
    role: "extensionista",
    organization_id: profile?.organization_id ?? "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [erros, setErros] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErros((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function validar() {
    const novosErros: Partial<Record<keyof FormData, string>> = {};
    if (!form.full_name || form.full_name.length < 3)
      novosErros.full_name = "Nome deve ter ao menos 3 caracteres";
    if (!form.email) novosErros.email = "E-mail é obrigatório";
    if (!form.password || form.password.length < 6)
      novosErros.password = "Senha deve ter ao menos 6 caracteres";
    if (isDeveloper && !form.organization_id)
      novosErros.organization_id = "Selecione uma organização";
    return novosErros;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }
    let avatar_url: string | undefined;
    if (avatar) {
      avatar_url = await upload(avatar);
    }
    criar({ ...form, organization_id: form.organization_id || undefined, avatar_url });
  }

  const isDirty =
    !!form.full_name ||
    !!form.email ||
    !!form.password ||
    form.role !== "extensionista" ||
    !!form.organization_id ||
    !!avatar;
  const isBusy = isPending || isUploading || isLoadingOrganizacoes;
  const availableRoles = roles.filter((role) => !role.developerOnly || isDeveloper);

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-8">
      <div className="space-y-4">
        <SectionTitle>Foto de perfil</SectionTitle>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-slate-400 text-xl font-medium">
                {form.full_name?.[0]?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 px-3 h-9 rounded-md text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <Upload className="w-4 h-4" />
                Escolher foto
              </span>
            </label>
            {avatar && (
              <button
                type="button"
                onClick={() => {
                  setAvatar(null);
                  setAvatarPreview(null);
                }}
                className="h-9 w-9 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle>Dados do usuário</SectionTitle>

        <div className="space-y-1.5">
          <label className={labelClass}>Nome completo *</label>
          <Input
            value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            placeholder="Nome do usuário"
            className={inputClass}
          />
          {erros.full_name && <p className={errClass}>{erros.full_name}</p>}
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>E-mail *</label>
          <Input
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            type="email"
            placeholder="email@exemplo.com"
            className={inputClass}
          />
          {erros.email && <p className={errClass}>{erros.email}</p>}
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Senha *</label>
          <Input
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            type="password"
            placeholder="Mínimo 6 caracteres"
            className={inputClass}
          />
          {erros.password && <p className={errClass}>{erros.password}</p>}
        </div>
      </div>

      {isDeveloper && (
        <div className="space-y-4">
          <SectionTitle>Organização</SectionTitle>
          <div className="space-y-1.5">
            <label className={labelClass}>Organização *</label>
            <Select
              value={form.organization_id}
              onValueChange={(value) => set("organization_id", value)}
              disabled={isBusy}
            >
              <SelectTrigger className="w-full bg-white border-slate-200 text-slate-800 focus:ring-cyan-500 h-10">
                <SelectValue placeholder={isLoadingOrganizacoes ? "Carregando..." : "Selecione"} />
              </SelectTrigger>
              <SelectContent>
                {(organizacoes ?? []).map((organizacao) => (
                  <SelectItem key={organizacao.id} value={organizacao.id}>
                    {organizacao.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {erros.organization_id && (
              <p className={errClass}>{erros.organization_id}</p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <SectionTitle>Permissão</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          {availableRoles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => set("role", r.value)}
              disabled={isBusy}
              className={`h-10 rounded-lg text-sm font-medium border transition-all ${
                form.role === r.value
                  ? "bg-cyan-600 border-cyan-500 text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400">
        {isBusy
          ? isUploading
            ? "Enviando foto..."
            : "Salvando usuário..."
          : isDirty
            ? "Alterações prontas para salvar."
            : "Preencha os dados para criar um usuário."}
      </p>

      <Button
        type="submit"
        disabled={isBusy || !isDirty}
        className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando foto...
          </>
        ) : isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Criando...
          </>
        ) : (
          "Criar usuário"
        )}
      </Button>
    </form>
  );
}

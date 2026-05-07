"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAvatarUpload } from "@/hooks/use-avatar";
import { Profile } from "@/types";
import { Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useAtualizarUsuario } from "../hooks/use-users";

type FormData = {
  full_name: string;
  email: string;
  password: string;
  role: "admin" | "extensionista" | "laudador";
};

type Props = {
  usuario: Profile;
  onSuccess: () => void;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-medium text-cyan-500 uppercase tracking-wider whitespace-nowrap">
        {children}
      </span>
      <div className="h-px bg-slate-800 flex-1" />
    </div>
  );
}

const inputClass =
  "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500 h-10";
const labelClass = "text-slate-400 text-xs mb-1.5 block";
const errClass = "text-red-400 text-xs mt-1";

const roles: { value: FormData["role"]; label: string }[] = [
  { value: "extensionista", label: "Extensionista" },
  { value: "laudador", label: "Laudador" },
  { value: "admin", label: "Administrador" },
];

export function EditarUsuarioForm({ usuario, onSuccess }: Props) {
  const { upload, isUploading } = useAvatarUpload();
  const { mutate: atualizar, isPending } = useAtualizarUsuario(
    usuario.id,
    onSuccess,
  );

  const [form, setForm] = useState<FormData>({
    full_name: usuario.full_name,
    email: "",
    password: "",
    role: usuario.role,
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    usuario.avatar_url ?? null,
  );
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
    if (form.password && form.password.length < 6)
      novosErros.password = "Senha deve ter ao menos 6 caracteres";
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

    atualizar({
      full_name: form.full_name,
      role: form.role,
      email: form.email || undefined,
      password: form.password || undefined,
      avatar_url: avatar_url ?? usuario.avatar_url ?? undefined,
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-8">
      <div className="space-y-4">
        <SectionTitle>Foto de perfil</SectionTitle>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-slate-500 text-xl font-medium">
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
              <span className="inline-flex items-center gap-2 px-3 h-9 rounded-md text-sm font-medium border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">
                <Upload className="w-4 h-4" />
                Trocar foto
              </span>
            </label>
            {avatarPreview && (
              <button
                type="button"
                onClick={() => {
                  setAvatar(null);
                  setAvatarPreview(null);
                }}
                className="h-9 w-9 flex items-center justify-center rounded-md border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
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
          <label className={labelClass}>Novo e-mail</label>
          <Input
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            type="email"
            placeholder="Deixe em branco para não alterar"
            className={inputClass}
          />
          {erros.email && <p className={errClass}>{erros.email}</p>}
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Nova senha</label>
          <Input
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            type="password"
            placeholder="Deixe em branco para não alterar"
            className={inputClass}
          />
          {erros.password && <p className={errClass}>{erros.password}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle>Permissão</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => set("role", r.value)}
              className={`h-10 rounded-lg text-sm font-medium border transition-all ${
                form.role === r.value
                  ? "bg-cyan-600 border-cyan-500 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending || isUploading}
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
            Salvando...
          </>
        ) : (
          "Salvar alterações"
        )}
      </Button>
    </form>
  );
}

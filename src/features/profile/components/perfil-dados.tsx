"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/use-profile";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAtualizarPerfil } from "../hooks/use-profile";

const inputClass =
  "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-cyan-500 h-10";
const labelClass = "text-slate-600 text-xs mb-1.5 block";

export function PerfilDados() {
  const { profile, user } = useProfile();
  const { mutate: atualizar, isPending } = useAtualizarPerfil();

  const [nome, setNome] = useState(profile?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [erro, setErro] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || nome.length < 3) {
      setErro("Nome deve ter ao menos 3 caracteres");
      return;
    }
    setErro("");
    atualizar({
      full_name: nome,
      email: email !== user?.email ? email : undefined,
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-xs font-medium text-cyan-600 uppercase tracking-wider mb-6">
        Dados pessoais
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className={labelClass}>Nome completo *</label>
          <Input
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              setErro("");
            }}
            placeholder="Seu nome completo"
            className={inputClass}
          />
          {erro && <p className="text-red-500 text-xs mt-1">{erro}</p>}
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>E-mail</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="seu@email.com"
            className={inputClass}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-10 bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </form>
    </div>
  );
}

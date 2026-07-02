"use client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAtualizarPerfil } from "../hooks/use-profile";

const inputClass =
  "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-cyan-500 h-10";
const labelClass = "text-slate-600 text-xs mb-1.5 block";

export function PerfilSenha() {
  const { mutate: atualizar, isPending } = useAtualizarPerfil();

  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const isDirty = !!senha || !!confirmar;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (senha.length < 6) {
      setErro("Senha deve ter ao menos 6 caracteres");
      return;
    }
    if (senha !== confirmar) {
      setErro("As senhas não coincidem");
      return;
    }
    setErro("");
    atualizar(
      { password: senha },
      {
        onSuccess: () => {
          setSenha("");
          setConfirmar("");
        },
      },
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-xs font-medium text-cyan-600 uppercase tracking-wider mb-6">
        Segurança
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className={labelClass}>Nova senha</label>
          <Input
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setErro("");
            }}
            type="password"
            placeholder="Mínimo 6 caracteres"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Confirmar nova senha</label>
          <Input
            value={confirmar}
            onChange={(e) => {
              setConfirmar(e.target.value);
              setErro("");
            }}
            type="password"
            placeholder="Repita a senha"
            className={inputClass}
          />
          {erro && <p className="text-red-500 text-xs mt-1">{erro}</p>}
        </div>

        <Button
          type="submit"
          disabled={isPending || !isDirty}
          className="w-full h-10 bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            "Alterar senha"
          )}
        </Button>
        <p className="text-xs text-slate-400">
          {isPending
            ? "Atualizando senha..."
            : isDirty
              ? "Senha pronta para validação."
              : "Informe uma nova senha para alterar."}
        </p>
      </form>
    </div>
  );
}

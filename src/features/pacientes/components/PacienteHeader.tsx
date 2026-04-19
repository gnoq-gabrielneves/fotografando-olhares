"use client";

import { Button } from "@/components/ui/button";
import { PacienteDetalhado } from "@/types";
import { ArrowLeft, FileText, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

const resultadoBadge: Record<string, string> = {
  "Sem RD": "bg-cyan-950 text-cyan-400 border border-cyan-900/50",
  "Não proliferativa": "bg-amber-950 text-amber-400 border border-amber-900/50",
  Proliferativa: "bg-red-950 text-red-400 border border-red-900/50",
  "Outra patologia":
    "bg-violet-950 text-violet-400 border border-violet-900/50",
};

function calcularIdade(data: string | null) {
  if (!data) return null;
  const diff = Date.now() - new Date(data).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

type Props = {
  paciente: PacienteDetalhado;
};

export function PacienteHeader({ paciente }: Props) {
  const router = useRouter();
  const idade = calcularIdade(paciente.data_nascimento);
  const ultimoLaudo = paciente.laudos?.[0];
  const resultado = ultimoLaudo?.resultado_rd;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      {/* Voltar */}
      <button
        onClick={() => router.push("/pacientes")}
        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para pacientes
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-white">
              {paciente.nome_completo}
            </h1>
            {resultado ? (
              <span
                className={`text-xs px-2.5 py-1 rounded-md font-medium border ${resultadoBadge[resultado] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}
              >
                {resultado}
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-slate-800 text-slate-500 border border-slate-700">
                Sem laudo
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-400 flex-wrap">
            <span>
              {paciente.sexo === "M"
                ? "Masculino"
                : paciente.sexo === "F"
                  ? "Feminino"
                  : "—"}
            </span>
            {idade && (
              <>
                <span className="text-slate-700">·</span>
                <span>{idade} anos</span>
              </>
            )}
            {paciente.locais_atendimento?.nome && (
              <>
                <span className="text-slate-700">·</span>
                <span>{paciente.locais_atendimento.nome}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push(`/pacientes/${paciente.id}/editar`)}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </Button>
          <Button
            onClick={() => router.push(`/pacientes/${paciente.id}/laudo`)}
            size="sm"
            className="gap-2 bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            <FileText className="w-4 h-4" />
            Novo laudo
          </Button>
        </div>
      </div>
    </div>
  );
}

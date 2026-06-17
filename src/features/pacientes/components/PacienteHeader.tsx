"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/query/keys";
import { resultadoBadge } from "@/lib/utils/resultado-badge";
import { PacienteDetalhado, ResultadoRD } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileText, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { excluirPaciente } from "../services/pacientes.services";

function calcularIdade(data: string | null) {
  if (!data) return null;
  const [y, m, d] = data.split("-").map(Number);
  const nascimento = new Date(y, m - 1, d);
  const diff = Date.now() - nascimento.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

type Props = {
  paciente: PacienteDetalhado;
};

export function PacienteHeader({ paciente }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const idade = calcularIdade(paciente.data_nascimento);
  const ultimoLaudo = paciente.laudos?.[0];
  const resultado = ultimoLaudo?.resultado_rd;

  const { mutate: deletar, isPending: isDeletando } = useMutation({
    mutationFn: () => excluirPaciente(paciente.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pacientes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.metricas });
      queryClient.invalidateQueries({
        queryKey: queryKeys.home.ultimosPacientes,
      });
      toast.success("Paciente excluído com sucesso!");
      router.push("/pacientes");
    },
    onError: (error) => {
      toast.error("Erro ao excluir paciente", { description: error.message });
    },
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
      <button
        onClick={() => router.push("/pacientes")}
        className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para pacientes
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-slate-800">
              {paciente.nome_completo}
            </h1>
            {resultado ? (
              <span
                className={`text-xs px-2.5 py-1 rounded-md font-medium border ${resultadoBadge[resultado as ResultadoRD] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}
              >
                {resultado}
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-orange-50 text-orange-600 border border-orange-200">
                Sem laudo
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
            <span>
              {paciente.sexo === "M"
                ? "Masculino"
                : paciente.sexo === "F"
                  ? "Feminino"
                  : "—"}
            </span>
            {idade && (
              <>
                <span className="text-slate-300">·</span>
                <span>{idade} anos</span>
              </>
            )}
            {paciente.locais_atendimento?.nome && (
              <>
                <span className="text-slate-300">·</span>
                <span>{paciente.locais_atendimento.nome}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white border-slate-200 !max-w-xs w-[calc(100%-2rem)] p-6 rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-200 mx-auto mb-4">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <AlertDialogHeader className="text-center space-y-1">
                <AlertDialogTitle className="text-slate-800 text-base">
                  Excluir paciente?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500 text-sm">
                  Todos os laudos de{" "}
                  <span className="text-slate-800 font-medium">
                    {paciente.nome_completo}
                  </span>{" "}
                  serão excluídos permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4 flex gap-2 sm:flex-row">
                <AlertDialogCancel className="flex-1 bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deletar()}
                  disabled={isDeletando}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white border-0"
                >
                  {isDeletando ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            onClick={() => router.push(`/pacientes/${paciente.id}/editar`)}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
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

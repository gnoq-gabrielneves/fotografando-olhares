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
} from "@/shared/components/ui/alert-dialog";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { queryKeys } from "@/shared/lib/query/keys";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import {
  getPacienteStatusBadge,
  getPacienteStatusLabel,
} from "@/shared/lib/utils/paciente-status";
import { resultadoBadge } from "@/shared/lib/utils/resultado-badge";
import { PacienteDetalhado, ResultadoRD } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileText, Pencil, Trash2, UserRound } from "lucide-react";
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
  const status = paciente.status_operacional ?? "cadastrado";
  const resultadoMeta = resultado ? (
    <span
      className={`text-xs px-2.5 py-1 rounded-md font-medium border ${resultadoBadge[resultado as ResultadoRD] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}
    >
      {resultado}
    </span>
  ) : (
    <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-orange-50 text-orange-600 border border-orange-200">
      Sem laudo
    </span>
  );

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
    <div className="space-y-4">
      <button
        onClick={() => router.push("/pacientes")}
        className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para pacientes
      </button>

      <PageHeader
        icon={UserRound}
        title={formatDisplayTextOrDash(paciente.nome_completo)}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>
              {paciente.sexo === "M"
                ? "Masculino"
                : paciente.sexo === "F"
                  ? "Feminino"
                  : "Sem sexo informado"}
            </span>
            {idade ? <span>{idade} anos</span> : null}
            {paciente.locais_atendimento?.nome ? (
              <span>{formatDisplayTextOrDash(paciente.locais_atendimento.nome)}</span>
            ) : null}
          </span>
        }
        meta={resultadoMeta}
        actions={
          <>
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
                      {formatDisplayTextOrDash(paciente.nome_completo)}
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
          </>
        }
      />
      <div
        className={`inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-xs font-medium ${getPacienteStatusBadge(status)}`}
      >
        {getPacienteStatusLabel(status)}
      </div>
    </div>
  );
}

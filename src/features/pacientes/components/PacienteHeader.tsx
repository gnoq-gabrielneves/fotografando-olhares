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
import { Button } from "@/shared/components/ui/button";
import {
  formatDateTimeToBrazilian,
  formatIsoDateToBrazilian,
} from "@/shared/lib/format/date";
import { queryKeys } from "@/shared/lib/query/keys";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import {
  getPacienteStatusBadge,
  getPacienteStatusLabel,
} from "@/shared/lib/utils/paciente-status";
import { resultadoBadge } from "@/shared/lib/utils/resultado-badge";
import { PacienteDetalhado, ResultadoRD } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  IdCard,
  MapPin,
  Pencil,
  Trash2,
  type LucideIcon,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { getPacientesReturnUrl } from "../lib/pacientes-return-url";
import { excluirPaciente } from "../services/pacientes.services";

function calcularIdade(data: string | null) {
  if (!data) return null;
  const [datePart] = data.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  if (!y || !m || !d) return null;
  const nascimento = new Date(y, m - 1, d);
  const diff = Date.now() - nascimento.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function formatarData(data: string | null) {
  return formatDateTimeToBrazilian(data) ?? "Sem data";
}

function formatarDataCivil(data: string | null) {
  return formatIsoDateToBrazilian(data) ?? "Sem data";
}

function sexoLabel(sexo: string | null) {
  if (sexo === "M") return "Masculino";
  if (sexo === "F") return "Feminino";
  return "Sem sexo informado";
}

type Props = {
  paciente: PacienteDetalhado;
  hasOftalmo: boolean;
};

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition-colors hover:border-slate-300">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
        <Icon className="size-3.5 text-cyan-600" />
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

export function PacienteHeader({ paciente, hasOftalmo }: Props) {
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
      router.push(getPacientesReturnUrl());
    },
    onError: (error) => {
      toast.error("Erro ao excluir paciente", { description: error.message });
    },
  });

  return (
    <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-1">
      <button
        onClick={() => router.push(getPacientesReturnUrl())}
        className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para pacientes
      </button>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-cyan-100 bg-cyan-50 text-cyan-700">
              <UserRound className="size-7" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900">
                  {formatDisplayTextOrDash(paciente.nome_completo)}
                </h1>
                {hasOftalmo ? resultadoMeta : null}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                <span>{sexoLabel(paciente.sexo)}</span>
                {idade ? <span>{idade} anos</span> : null}
                <span>
                  Cadastro em {formatarData(paciente.created_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
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

            {hasOftalmo ? (
              <Button
                onClick={() => router.push(`/pacientes/${paciente.id}/laudo`)}
                size="sm"
                className="gap-2 bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                <FileText className="w-4 h-4" />
                Novo laudo
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryItem
            icon={IdCard}
            label="Prontuário"
            value={formatDisplayTextOrDash(paciente.prontuario)}
          />
          <SummaryItem
            icon={MapPin}
            label="Local"
            value={formatDisplayTextOrDash(paciente.locais_atendimento?.nome)}
          />
          <SummaryItem
            icon={CalendarDays}
            label="Nascimento"
            value={formatarDataCivil(paciente.data_nascimento)}
          />
          {hasOftalmo ? (
            <SummaryItem
              icon={ClipboardList}
              label="Esteira"
              value={
                <span
                  className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${getPacienteStatusBadge(status)}`}
                >
                  {getPacienteStatusLabel(status)}
                </span>
              }
            />
          ) : (
            <SummaryItem
              icon={ClipboardList}
              label="Responsável"
              value={formatDisplayTextOrDash(paciente.profiles?.full_name)}
            />
          )}
        </div>
      </section>
    </div>
  );
}

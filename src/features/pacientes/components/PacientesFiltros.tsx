"use client";

import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Input } from "@/shared/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Search, X } from "lucide-react";
import { PACIENTE_STATUS_OPERACIONAIS } from "@/shared/types";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import { getPacienteStatusLabel } from "@/shared/lib/utils/paciente-status";
import { getLocaisAtendimento } from "../services/pacientes.services";

type Props = {
  busca: string;
  resultadoRd: string;
  statusOperacional: string;
  localId: string;
  dataInicio: string;
  dataFim: string;
  onBuscaChange: (v: string) => void;
  onResultadoChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onLocalChange: (v: string) => void;
  onDataInicioChange: (v: string) => void;
  onDataFimChange: (v: string) => void;
  hasOftalmo: boolean;
};

function toDate(s: string) {
  return s ? parseISO(s) : undefined;
}

function toStr(d: Date | undefined) {
  return d ? format(d, "yyyy-MM-dd") : "";
}

function labelData(de: string, ate: string) {
  if (de && ate) return `${format(parseISO(de), "dd/MM")} – ${format(parseISO(ate), "dd/MM")}`;
  if (de) return `A partir de ${format(parseISO(de), "dd/MM")}`;
  if (ate) return `Até ${format(parseISO(ate), "dd/MM")}`;
  return null;
}

export function PacientesFiltros({
  busca,
  resultadoRd,
  statusOperacional,
  localId,
  dataInicio,
  dataFim,
  onBuscaChange,
  onResultadoChange,
  onStatusChange,
  onLocalChange,
  onDataInicioChange,
  onDataFimChange,
  hasOftalmo,
}: Props) {
  const { data: locais } = useQuery({
    queryKey: ["locais_atendimento"],
    queryFn: getLocaisAtendimento,
  });

  const label = labelData(dataInicio, dataFim);
  const temData = !!(dataInicio || dataFim);

  function limparDatas() {
    onDataInicioChange("");
    onDataFimChange("");
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative min-w-48 flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <Input
          placeholder="Buscar por nome ou CPF/CNS..."
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="pl-8 h-9 text-sm bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-cyan-500"
        />
      </div>

      {hasOftalmo ? (
        <div className="w-full sm:w-44">
          <Select value={resultadoRd} onValueChange={onResultadoChange}>
            <SelectTrigger className="h-9 bg-white text-sm text-slate-700 border-slate-200">
              <SelectValue placeholder="Resultado" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="todos">Todos os resultados</SelectItem>
              <SelectItem value="sem_laudo">Sem laudo</SelectItem>
              <SelectItem value="Exame de retinografia normal">Normal</SelectItem>
              <SelectItem value="Retinopatia diabética não proliferativa">RD não proliferativa</SelectItem>
              <SelectItem value="Retinopatia diabética proliferativa">RD proliferativa</SelectItem>
              <SelectItem value="Retinopatia hipertensiva">RD hipertensiva</SelectItem>
              <SelectItem value="Outras alterações">Outras alterações</SelectItem>
              <SelectItem value="Qualidade da imagem ruim">Imagem ruim</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {hasOftalmo ? (
        <div className="w-full sm:w-44">
          <Select value={statusOperacional} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9 bg-white text-sm text-slate-700 border-slate-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="todos">Todos os status</SelectItem>
              {PACIENTE_STATUS_OPERACIONAIS.map((status) => (
                <SelectItem key={status} value={status}>
                  {getPacienteStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div className="w-full sm:w-40">
        <Select value={localId} onValueChange={onLocalChange}>
          <SelectTrigger className="h-9 bg-white text-sm text-slate-700 border-slate-200">
            <SelectValue placeholder="Local" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="todos">Todos os locais</SelectItem>
            {locais?.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {formatDisplayTextOrDash(l.nome)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`h-9 text-sm gap-2 font-normal border-slate-200 bg-white ${temData ? "text-cyan-700 border-cyan-300 bg-cyan-50" : "text-slate-500"}`}
          >
            <CalendarDays className="w-3.5 h-3.5 shrink-0" />
            <span>{label ?? "Período"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <p className="text-xs font-medium text-slate-500 mb-3">Selecione o intervalo</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1.5">De</p>
              <Calendar
                mode="single"
                selected={toDate(dataInicio)}
                onSelect={(d) => onDataInicioChange(toStr(d))}
                locale={ptBR}
                disabled={(d) => (toDate(dataFim) ? d > toDate(dataFim)! : false)}
              />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Até</p>
              <Calendar
                mode="single"
                selected={toDate(dataFim)}
                onSelect={(d) => onDataFimChange(toStr(d))}
                locale={ptBR}
                disabled={(d) => (toDate(dataInicio) ? d < toDate(dataInicio)! : false)}
              />
            </div>
          </div>
          {temData && (
            <button
              onClick={limparDatas}
              className="mt-3 text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Limpar datas
            </button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

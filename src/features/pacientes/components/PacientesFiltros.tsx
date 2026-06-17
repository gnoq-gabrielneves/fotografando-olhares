"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Search } from "lucide-react";
import { getLocaisAtendimento } from "../services/pacientes.services";

type Props = {
  busca: string;
  resultadoRd: string;
  localId: string;
  dataInicio: string;
  dataFim: string;
  onBuscaChange: (v: string) => void;
  onResultadoChange: (v: string) => void;
  onLocalChange: (v: string) => void;
  onDataInicioChange: (v: string) => void;
  onDataFimChange: (v: string) => void;
};

export function PacientesFiltros({
  busca,
  resultadoRd,
  localId,
  dataInicio,
  dataFim,
  onBuscaChange,
  onResultadoChange,
  onLocalChange,
  onDataInicioChange,
  onDataFimChange,
}: Props) {
  const { data: locais } = useQuery({
    queryKey: ["locais_atendimento"],
    queryFn: getLocaisAtendimento,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome ou CPF/CNS..."
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            className="pl-9 bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-cyan-500 h-10"
          />
        </div>

        <Select value={resultadoRd} onValueChange={onResultadoChange}>
          <SelectTrigger className="w-full sm:w-56 bg-white border-slate-200 text-slate-700 focus:ring-cyan-500 h-10">
            <SelectValue placeholder="Resultado" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200 text-slate-700" position="popper">
            <SelectItem value="todos">Todos os resultados</SelectItem>
            <SelectItem value="sem_laudo">Sem laudo</SelectItem>
            <SelectItem value="Exame de retinografia normal">Exame de retinografia normal</SelectItem>
            <SelectItem value="Retinopatia diabética não proliferativa">Retinopatia diabética não proliferativa</SelectItem>
            <SelectItem value="Retinopatia diabética proliferativa">Retinopatia diabética proliferativa</SelectItem>
            <SelectItem value="Retinopatia hipertensiva">Retinopatia hipertensiva</SelectItem>
            <SelectItem value="Outras alterações">Outras alterações</SelectItem>
            <SelectItem value="Qualidade da imagem ruim">Qualidade da imagem ruim</SelectItem>
          </SelectContent>
        </Select>

        <Select value={localId} onValueChange={onLocalChange}>
          <SelectTrigger className="w-full sm:w-48 bg-white border-slate-200 text-slate-700 focus:ring-cyan-500 h-10">
            <SelectValue placeholder="Local" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200 text-slate-700" position="popper">
            <SelectItem value="todos">Todos os locais</SelectItem>
            {locais?.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
          <CalendarDays className="w-4 h-4" />
          Cadastrado entre
        </div>
        <div className="flex flex-1 gap-3">
          <Input
            type="date"
            value={dataInicio}
            onChange={(e) => onDataInicioChange(e.target.value)}
            className="flex-1 bg-white border-slate-200 text-slate-700 focus-visible:ring-cyan-500 h-10 text-sm"
          />
          <Input
            type="date"
            value={dataFim}
            onChange={(e) => onDataFimChange(e.target.value)}
            className="flex-1 bg-white border-slate-200 text-slate-700 focus-visible:ring-cyan-500 h-10 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

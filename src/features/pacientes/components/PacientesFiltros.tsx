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
import { Search } from "lucide-react";
import { getLocaisAtendimento } from "../queries/queries-pacientes";

type Props = {
  busca: string;
  resultadoRd: string;
  localId: string;
  onBuscaChange: (v: string) => void;
  onResultadoChange: (v: string) => void;
  onLocalChange: (v: string) => void;
};

export function PacientesFiltros({
  busca,
  resultadoRd,
  localId,
  onBuscaChange,
  onResultadoChange,
  onLocalChange,
}: Props) {
  const { data: locais } = useQuery({
    queryKey: ["locais_atendimento"],
    queryFn: getLocaisAtendimento,
  });

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="pl-9 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500 h-10"
        />
      </div>

      <Select value={resultadoRd} onValueChange={onResultadoChange}>
        <SelectTrigger className="w-full sm:w-48 bg-slate-900 border-slate-700 text-slate-300 focus:ring-cyan-500 h-10">
          <SelectValue placeholder="Resultado" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
          <SelectItem value="todos">Todos os resultados</SelectItem>
          <SelectItem value="sem_laudo">Sem laudo</SelectItem>
          <SelectItem value="Sem RD">Sem RD</SelectItem>
          <SelectItem value="Não proliferativa">Não proliferativa</SelectItem>
          <SelectItem value="Proliferativa">Proliferativa</SelectItem>
          <SelectItem value="Outra patologia">Outra patologia</SelectItem>
        </SelectContent>
      </Select>

      <Select value={localId} onValueChange={onLocalChange}>
        <SelectTrigger className="w-full sm:w-48 bg-slate-900 border-slate-700 text-slate-300 focus:ring-cyan-500 h-10">
          <SelectValue placeholder="Local" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
          <SelectItem value="todos">Todos os locais</SelectItem>
          {locais?.map((l) => (
            <SelectItem key={l.id} value={l.id}>
              {l.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

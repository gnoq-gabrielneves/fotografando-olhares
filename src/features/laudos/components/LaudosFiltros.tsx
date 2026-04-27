"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

type Props = {
  busca: string;
  resultadoRd: string;
  onBuscaChange: (v: string) => void;
  onResultadoChange: (v: string) => void;
};

export function LaudosFiltros({
  busca,
  resultadoRd,
  onBuscaChange,
  onResultadoChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Buscar por paciente..."
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="pl-9 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500 h-10"
        />
      </div>

      <Select value={resultadoRd} onValueChange={onResultadoChange}>
        <SelectTrigger className="w-full sm:w-56 bg-slate-900 border-slate-700 text-slate-300 focus:ring-cyan-500 h-10">
          <SelectValue placeholder="Resultado" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
          <SelectItem value="todos">Todos os resultados</SelectItem>
          <SelectItem value="Exame de retinografia normal">
            Exame de retinografia normal
          </SelectItem>
          <SelectItem value="Retinopatia diabética não proliferativa">
            Retinopatia diabética não proliferativa
          </SelectItem>
          <SelectItem value="Retinopatia diabética proliferativa">
            Retinopatia diabética proliferativa
          </SelectItem>
          <SelectItem value="Retinopatia hipertensiva">
            Retinopatia hipertensiva
          </SelectItem>
          <SelectItem value="Outras alterações">Outras alterações</SelectItem>
          <SelectItem value="Qualidade da imagem ruim">
            Qualidade da imagem ruim
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

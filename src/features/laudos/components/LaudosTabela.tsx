"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryKeys } from "@/lib/query/keys";
import { resultadoBadge } from "@/lib/utils/resultado-badge";
import { ResultadoRD } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDebounce } from "use-debounce";
import { LaudoTabela } from "../laudo-types";
import { getLaudos } from "../services/getLaudos";
import { LaudosFiltros } from "./LaudosFiltros";

const PAGE_SIZE = 10;

function formatarData(data: string | null) {
  if (!data) return "—";
  return new Date(data).toLocaleDateString("pt-BR");
}

export function LaudosTabela() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [busca, setBusca] = useState("");
  const [resultadoRd, setResultadoRd] = useState("todos");
  const [buscaDebounced] = useDebounce(busca, 400);

  const filtros = {
    busca: buscaDebounced,
    resultado_rd: resultadoRd,
    page,
    pageSize: PAGE_SIZE,
  };

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.laudos.lista(filtros),
    queryFn: () => getLaudos(filtros),
  });

  const handleFiltroChange = useCallback((fn: () => void) => {
    setPage(1);
    fn();
  }, []);

  const totalPages = Math.ceil((data?.count ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-4">
      <LaudosFiltros
        busca={busca}
        resultadoRd={resultadoRd}
        onBuscaChange={(v: string) => handleFiltroChange(() => setBusca(v))}
        onResultadoChange={(v: string) =>
          handleFiltroChange(() => setResultadoRd(v))
        }
      />

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 hover:bg-transparent bg-slate-50">
              <TableHead className="text-slate-500 font-medium">
                Paciente
              </TableHead>
              <TableHead className="text-slate-500 font-medium">
                Resultado
              </TableHead>
              <TableHead className="text-slate-500 font-medium">
                Laudador
              </TableHead>
              <TableHead className="text-slate-500 font-medium">Data</TableHead>
              <TableHead className="text-slate-500 font-medium w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <TableRow key={i} className="border-slate-200">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data.length === 0 ? (
              <TableRow className="border-slate-200">
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-slate-400"
                >
                  Nenhum laudo encontrado
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((laudo: LaudoTabela) => (
                <TableRow
                  key={laudo.id}
                  className="border-slate-200 hover:bg-slate-50 cursor-pointer"
                  onClick={() =>
                    router.push(`/pacientes/${laudo.pacientes?.id}`)
                  }
                >
                  <TableCell className="text-slate-800 font-medium">
                    {laudo.pacientes?.nome_completo ?? "—"}
                  </TableCell>
                  <TableCell>
                    {laudo.resultado_rd ? (
                      <span
                        className={`text-xs px-2 py-1 rounded-md font-medium border ${resultadoBadge[laudo.resultado_rd as ResultadoRD] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}
                      >
                        {laudo.resultado_rd}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-md font-medium bg-slate-100 text-slate-500 border border-slate-200">
                        Sem resultado
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {laudo.profiles?.full_name ?? "—"}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {formatarData(laudo.data_laudo)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/pacientes/${laudo.pacientes?.id}`);
                      }}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Ver paciente"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-slate-500">
            {data?.count} laudos · página {page} de {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="h-8 w-8 p-0 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              ‹
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="h-8 w-8 p-0 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              ›
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

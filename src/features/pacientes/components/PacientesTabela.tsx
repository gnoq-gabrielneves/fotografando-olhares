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
import { PacienteTabela, ResultadoRD } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FileText } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import { getPacientes } from "../services/pacientes.services";
import { PacientesFiltros } from "./PacientesFiltros";
import { PacientesPaginacao } from "./PacientesPaginacao";

const PAGE_SIZE = 10;

function calcularIdade(data: string | null) {
  if (!data) return null;
  const [y, m, d] = data.split("-").map(Number);
  const nascimento = new Date(y, m - 1, d);
  const diff = Date.now() - nascimento.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export function PacientesTabela() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const busca = searchParams.get("busca") ?? "";
  const resultadoRd = searchParams.get("resultado") ?? "todos";
  const localId = searchParams.get("local") ?? "todos";
  const dataInicio = searchParams.get("de") ?? "";
  const dataFim = searchParams.get("ate") ?? "";
  const page = Number(searchParams.get("pagina") ?? "1");

  const [buscaDebounced] = useDebounce(busca, 400);

  const filtros = {
    busca: buscaDebounced,
    resultado_rd: resultadoRd,
    local_id: localId,
    data_inicio: dataInicio,
    data_fim: dataFim,
    page,
    pageSize: PAGE_SIZE,
  };

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.pacientes.lista(filtros),
    queryFn: () => getPacientes(filtros),
  });

  const setParam = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v && v !== "todos") {
          params.set(k, v);
        } else {
          params.delete(k);
        }
      });
      params.delete("pagina");
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router],
  );

  const setPage = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (p === 1) {
        params.delete("pagina");
      } else {
        params.set("pagina", String(p));
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router],
  );

  return (
    <div className="space-y-4">
      <PacientesFiltros
        busca={busca}
        resultadoRd={resultadoRd}
        localId={localId}
        dataInicio={dataInicio}
        dataFim={dataFim}
        onBuscaChange={(v) => setParam({ busca: v })}
        onResultadoChange={(v) => setParam({ resultado: v })}
        onLocalChange={(v) => setParam({ local: v })}
        onDataInicioChange={(v) => setParam({ de: v })}
        onDataFimChange={(v) => setParam({ ate: v })}
      />

      {!isLoading && data && (
        <p className="text-xs text-slate-400">
          {data.count === 0
            ? "Nenhum paciente encontrado"
            : `${data.count} paciente${data.count !== 1 ? "s" : ""} encontrado${data.count !== 1 ? "s" : ""}`}
        </p>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent bg-slate-50">
                <TableHead className="text-slate-500 font-medium">Paciente</TableHead>
                <TableHead className="text-slate-500 font-medium hidden sm:table-cell">Sexo</TableHead>
                <TableHead className="text-slate-500 font-medium hidden sm:table-cell">Idade</TableHead>
                <TableHead className="text-slate-500 font-medium hidden md:table-cell">Local</TableHead>
                <TableHead className="text-slate-500 font-medium hidden lg:table-cell">Extensionista</TableHead>
                <TableHead className="text-slate-500 font-medium">Laudo</TableHead>
                <TableHead className="text-slate-500 font-medium w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <TableRow key={i} className="border-slate-200">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow className="border-slate-200">
                  <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                    Nenhum paciente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((paciente: PacienteTabela) => {
                  const resultado = paciente.laudos?.[0]?.resultado_rd;
                  const local = paciente.locais_atendimento?.nome ?? "—";
                  const extensionista = paciente.profiles?.full_name ?? "—";
                  const idade = calcularIdade(paciente.data_nascimento);

                  return (
                    <TableRow
                      key={paciente.id}
                      className="border-slate-200 hover:bg-slate-50 cursor-pointer"
                      onClick={() => router.push(`/pacientes/${paciente.id}`)}
                    >
                      <TableCell className="text-slate-800 font-medium">
                        {paciente.nome_completo}
                      </TableCell>
                      <TableCell className="text-slate-600 hidden sm:table-cell">
                        {paciente.sexo === "M" ? "Masculino" : paciente.sexo === "F" ? "Feminino" : "—"}
                      </TableCell>
                      <TableCell className="text-slate-600 hidden sm:table-cell">
                        {idade ? `${idade} anos` : "—"}
                      </TableCell>
                      <TableCell className="text-slate-600 hidden md:table-cell">{local}</TableCell>
                      <TableCell className="text-slate-600 hidden lg:table-cell">{extensionista}</TableCell>
                      <TableCell>
                        {resultado ? (
                          <span className={`text-xs px-2 py-1 rounded-md font-medium border ${resultadoBadge[resultado as ResultadoRD] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
                            {resultado}
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-md font-medium bg-orange-50 text-orange-600 border border-orange-200">
                            Sem laudo
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/pacientes/${paciente.id}/laudo`);
                            }}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50"
                            title="Adicionar laudo"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/pacientes/${paciente.id}`);
                            }}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Ver detalhes"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <PacientesPaginacao
        page={page}
        pageSize={PAGE_SIZE}
        total={data?.count ?? 0}
        onPageChange={setPage}
      />
    </div>
  );
}

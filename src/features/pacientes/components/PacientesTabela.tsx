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
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
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
  const [page, setPage] = useState(1);
  const [busca, setBusca] = useState("");
  const [resultadoRd, setResultadoRd] = useState("todos");
  const [localId, setLocalId] = useState("todos");
  const [buscaDebounced] = useDebounce(busca, 400);

  const filtros = {
    busca: buscaDebounced,
    resultado_rd: resultadoRd,
    local_id: localId,
    page,
    pageSize: PAGE_SIZE,
  };

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.pacientes.lista(filtros),
    queryFn: () => getPacientes(filtros),
  });

  const handleFiltroChange = useCallback((fn: () => void) => {
    setPage(1);
    fn();
  }, []);

  return (
    <div className="space-y-4">
      <PacientesFiltros
        busca={busca}
        resultadoRd={resultadoRd}
        localId={localId}
        onBuscaChange={(v) => handleFiltroChange(() => setBusca(v))}
        onResultadoChange={(v: string) =>
          handleFiltroChange(() => setResultadoRd(v))
        }
        onLocalChange={(v: string) => handleFiltroChange(() => setLocalId(v))}
      />

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 hover:bg-transparent bg-slate-50">
              <TableHead className="text-slate-500 font-medium">
                Paciente
              </TableHead>
              <TableHead className="text-slate-500 font-medium">Sexo</TableHead>
              <TableHead className="text-slate-500 font-medium">
                Idade
              </TableHead>
              <TableHead className="text-slate-500 font-medium">
                Local
              </TableHead>
              <TableHead className="text-slate-500 font-medium">
                Extensionista
              </TableHead>
              <TableHead className="text-slate-500 font-medium">
                Laudo
              </TableHead>
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
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-slate-400"
                >
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
                    <TableCell className="text-slate-600">
                      {paciente.sexo === "M"
                        ? "Masculino"
                        : paciente.sexo === "F"
                          ? "Feminino"
                          : "—"}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {idade ? `${idade} anos` : "—"}
                    </TableCell>
                    <TableCell className="text-slate-600">{local}</TableCell>
                    <TableCell className="text-slate-600">
                      {extensionista}
                    </TableCell>
                    <TableCell>
                      {resultado ? (
                        <span
                          className={`text-xs px-2 py-1 rounded-md font-medium border ${resultadoBadge[resultado as ResultadoRD] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}
                        >
                          {resultado}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-md font-medium bg-slate-100 text-slate-500 border border-slate-200">
                          Sem laudo
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
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

      <PacientesPaginacao
        page={page}
        pageSize={PAGE_SIZE}
        total={data?.count ?? 0}
        onPageChange={setPage}
      />
    </div>
  );
}

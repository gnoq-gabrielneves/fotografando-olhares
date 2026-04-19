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
import { PacienteTabela } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDebounce } from "use-debounce";
import { getPacientes } from "../queries/queries-pacientes";
import { PacientesFiltros } from "./PacientesFiltros";
import { PacientesPaginacao } from "./PacientesPaginacao";

const PAGE_SIZE = 10;

const resultadoConfig: Record<string, { label: string; className: string }> = {
  "Sem RD": "bg-cyan-950 text-cyan-400 border-cyan-900/50",
  "Não proliferativa": "bg-amber-950 text-amber-400 border-amber-900/50",
  Proliferativa: "bg-red-950 text-red-400 border-red-900/50",
  "Outra patologia": "bg-violet-950 text-violet-400 border-violet-900/50",
} as unknown as Record<string, { label: string; className: string }>;

const resultadoBadge: Record<string, string> = {
  "Sem RD": "bg-cyan-950 text-cyan-400 border border-cyan-900/50",
  "Não proliferativa": "bg-amber-950 text-amber-400 border border-amber-900/50",
  Proliferativa: "bg-red-950 text-red-400 border border-red-900/50",
  "Outra patologia":
    "bg-violet-950 text-violet-400 border border-violet-900/50",
};

function formatarData(data: string | null) {
  if (!data) return "—";
  return new Date(data).toLocaleDateString("pt-BR");
}

function calcularIdade(data: string | null) {
  if (!data) return null;
  const diff = Date.now() - new Date(data).getTime();
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
        onResultadoChange={(v) => handleFiltroChange(() => setResultadoRd(v))}
        onLocalChange={(v) => handleFiltroChange(() => setLocalId(v))}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400 font-medium">
                Paciente
              </TableHead>
              <TableHead className="text-slate-400 font-medium">Sexo</TableHead>
              <TableHead className="text-slate-400 font-medium">
                Idade
              </TableHead>
              <TableHead className="text-slate-400 font-medium">
                Local
              </TableHead>
              <TableHead className="text-slate-400 font-medium">
                Extensionista
              </TableHead>
              <TableHead className="text-slate-400 font-medium">
                Laudo
              </TableHead>
              <TableHead className="text-slate-400 font-medium w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <TableRow key={i} className="border-slate-800">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-slate-800 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data.length === 0 ? (
              <TableRow className="border-slate-800">
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-slate-500"
                >
                  Nenhum paciente encontrado
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((paciente: PacienteTabela) => {
                const resultado = paciente.laudos?.[0]?.resultado_rd;
                const local = paciente.locais_atendimento?.[0]?.nome ?? "—";
                const extensionista = paciente.profiles?.[0]?.full_name ?? "—";
                const idade = calcularIdade(paciente.data_nascimento);

                return (
                  <TableRow
                    key={paciente.id}
                    className="border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                    onClick={() => router.push(`/pacientes/${paciente.id}`)}
                  >
                    <TableCell className="text-white font-medium">
                      {paciente.nome_completo}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {paciente.sexo === "M"
                        ? "Masculino"
                        : paciente.sexo === "F"
                          ? "Feminino"
                          : "—"}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {idade ? `${idade} anos` : "—"}
                    </TableCell>
                    <TableCell className="text-slate-400">{local}</TableCell>
                    <TableCell className="text-slate-400">
                      {extensionista}
                    </TableCell>
                    <TableCell>
                      {resultado ? (
                        <span
                          className={`text-xs px-2 py-1 rounded-md font-medium border ${resultadoBadge[resultado] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}
                        >
                          {resultado}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-md font-medium bg-slate-800 text-slate-500 border border-slate-700">
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
                          className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
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
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
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

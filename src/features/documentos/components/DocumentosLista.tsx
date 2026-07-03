"use client";

import { ClipboardPlus, Download, Printer } from "lucide-react";
import { EmptyState, QueryErrorState } from "@/shared/components/states/EmptyState";
import { TableSkeletonRows } from "@/shared/components/states/TableSkeletonRows";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import { DocumentoPreviewDialog } from "./DocumentoPreviewDialog";
import {
  documentoStatusBadge,
  documentoStatusLabel,
  documentoTipoLabel,
} from "../lib/documentos-labels";
import { downloadDocumento, printDocumento } from "../lib/documento-render";
import { useDocumentosClinicos } from "../hooks/use-documentos";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}

export function DocumentosLista() {
  const { data, error, isError, isLoading } = useDocumentosClinicos();

  if (isError) return <QueryErrorState message={error.message} />;

  return (
    <div className="space-y-4">
      {!isLoading && data ? (
        <p className="text-xs text-slate-400 transition-opacity">
          {data.length === 0
            ? "Nenhum documento emitido"
            : `${data.length} documento${data.length === 1 ? "" : "s"} emitido${data.length === 1 ? "" : "s"}`}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-50">
              <TableHead className="text-slate-500">Documento</TableHead>
              <TableHead className="hidden text-slate-500 md:table-cell">
                Paciente
              </TableHead>
              <TableHead className="hidden text-slate-500 lg:table-cell">
                Responsável
              </TableHead>
              <TableHead className="text-slate-500">Status</TableHead>
              <TableHead className="hidden text-slate-500 sm:table-cell">
                Emissão
              </TableHead>
              <TableHead className="w-32 text-right text-slate-500">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonRows rows={6} columns={6} />
            ) : !data?.length ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12">
                  <EmptyState
                    icon={ClipboardPlus}
                    title="Nenhum documento emitido"
                    description="Solicitações de exames e receitas brancas aparecerão aqui."
                    className="border-0 shadow-none"
                  />
                </TableCell>
              </TableRow>
            ) : (
              data.map((documento) => (
                <TableRow
                  key={documento.id}
                  className="border-slate-200 transition-colors hover:bg-slate-50"
                >
                  <TableCell>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {documento.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {documentoTipoLabel[documento.document_type]}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-slate-600 md:table-cell">
                    {formatDisplayTextOrDash(documento.pacientes?.nome_completo)}
                  </TableCell>
                  <TableCell className="hidden text-slate-600 lg:table-cell">
                    {formatDisplayTextOrDash(documento.profiles?.full_name)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={documentoStatusBadge[documento.status]}
                    >
                      {documentoStatusLabel[documento.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-slate-600 sm:table-cell">
                    {formatDate(documento.issued_at ?? documento.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <DocumentoPreviewDialog documento={documento} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        title="Baixar documento"
                        onClick={() => downloadDocumento(documento)}
                      >
                        <Download />
                        <span className="sr-only">Baixar documento</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        title="Imprimir documento"
                        onClick={() => printDocumento(documento)}
                      >
                        <Printer />
                        <span className="sr-only">Imprimir documento</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

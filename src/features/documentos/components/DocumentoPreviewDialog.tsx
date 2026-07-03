"use client";

import { Download, Eye, Printer } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import type { DocumentoClinicoTabela } from "@/shared/types";
import { documentoTipoLabel } from "../lib/documentos-labels";
import { downloadDocumento, printDocumento } from "../lib/documento-render";

type DocumentoPreviewDialogProps = {
  documento: DocumentoClinicoTabela;
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}

export function DocumentoPreviewDialog({
  documento,
}: DocumentoPreviewDialogProps) {
  const tipo = documentoTipoLabel[documento.document_type];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          title="Visualizar documento"
        >
          <Eye />
          <span className="sr-only">Visualizar documento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] w-[min(calc(100vw-2rem),780px)] gap-4 overflow-hidden bg-slate-100 p-0">
        <div className="border-b border-slate-200 bg-white px-5 py-4">
          <DialogHeader>
            <DialogTitle className="text-base text-slate-900">
              Preview do documento
            </DialogTitle>
            <DialogDescription>
              Confira o conteúdo antes de baixar ou imprimir.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto px-4 pb-4 sm:px-6">
          <article className="mx-auto my-3 min-h-[720px] w-full max-w-[620px] animate-in fade-in-0 zoom-in-95 rounded-sm bg-white p-8 text-slate-800 shadow-sm ring-1 ring-slate-200 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
              {tipo}
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-slate-950">
              {documento.title}
            </h2>

            <dl className="mt-8 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Paciente
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {formatDisplayTextOrDash(documento.pacientes?.nome_completo)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Responsável
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {formatDisplayTextOrDash(documento.profiles?.full_name)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Emissão
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {formatDate(documento.issued_at ?? documento.created_at)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Tipo
                </dt>
                <dd className="mt-1 font-medium text-slate-700">{tipo}</dd>
              </div>
            </dl>

            <div className="mt-8 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {documento.content}
            </div>

            <div className="mt-20 w-64 border-t border-slate-400 pt-3 text-center text-xs text-slate-500">
              {formatDisplayTextOrDash(documento.profiles?.full_name)}
            </div>
          </article>
        </div>

        <DialogFooter className="border-t border-slate-200 bg-white px-5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => downloadDocumento(documento)}
          >
            <Download />
            Baixar
          </Button>
          <Button type="button" onClick={() => printDocumento(documento)}>
            <Printer />
            Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

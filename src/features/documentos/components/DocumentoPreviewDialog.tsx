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
import { markdownToHtml } from "../lib/documento-markdown";
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

function formatShortDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}

function formatSexo(value: string | null | undefined) {
  if (value === "M") return "Masculino";
  if (value === "F") return "Feminino";
  return "—";
}

export function DocumentoPreviewDialog({
  documento,
}: DocumentoPreviewDialogProps) {
  const tipo = documentoTipoLabel[documento.document_type];
  const contentHtml = markdownToHtml(documento.content);
  const emissao = formatDate(documento.issued_at ?? documento.created_at);
  const localData = [documento.clinic_city, emissao].filter(Boolean).join(", ");

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
      <DialogContent className="max-h-[94vh] w-[min(calc(100vw-2rem),1120px)] gap-0 overflow-hidden bg-slate-100 p-0 sm:max-w-[min(calc(100vw-2rem),1120px)]">
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

        <div className="max-h-[calc(94vh-9.5rem)] overflow-y-auto px-4 py-5 sm:px-8">
          <article className="mx-auto min-h-[860px] w-full max-w-[780px] animate-in fade-in-0 zoom-in-95 rounded-sm bg-white p-8 text-slate-800 shadow-md ring-1 ring-slate-200 sm:p-12">
            <header className="mb-8 flex items-start justify-between gap-5">
              <div className="flex items-center gap-3">
                {documento.clinic_logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={documento.clinic_logo_url}
                    alt=""
                    className="h-14 w-14 object-contain"
                  />
                ) : null}
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {documento.clinic_name ?? "Clínica/Hospital"}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
                    {tipo}
                  </p>
                </div>
              </div>
              <p className="max-w-48 text-right text-xs leading-5 text-slate-500">
                {localData || emissao}
              </p>
            </header>
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
                  Nascimento
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {formatShortDate(documento.pacientes?.data_nascimento)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Sexo
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {formatSexo(documento.pacientes?.sexo)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Nome da mãe
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {formatDisplayTextOrDash(documento.pacientes?.nome_mae)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Telefone
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {formatDisplayTextOrDash(documento.pacientes?.telefone)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Endereço
                </dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {formatDisplayTextOrDash(documento.pacientes?.endereco)}
                </dd>
              </div>
            </dl>

            {documento.clinical_justification ||
            documento.material_to_examine ? (
              <dl className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Justificativa clínica
                  </dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    {formatDisplayTextOrDash(documento.clinical_justification)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Material a examinar
                  </dt>
                  <dd className="mt-1 font-medium text-slate-700">
                    {formatDisplayTextOrDash(documento.material_to_examine)}
                  </dd>
                </div>
              </dl>
            ) : null}

            <section className="mt-8">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Conteúdo
              </p>
              <div
                className="text-sm leading-7 text-slate-700 [&_.empty]:text-slate-400 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:my-1 [&_ol]:mb-4 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_ul]:mb-4 [&_ul]:ml-5 [&_ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </section>

            <div className="mt-20 w-64 border-t border-slate-400 pt-3 text-center text-xs text-slate-500">
              <strong className="block text-slate-700">
                {formatDisplayTextOrDash(documento.physician_name)}
              </strong>
              {formatDisplayTextOrDash(documento.physician_crm)}
            </div>
            <p className="mt-8 border-t border-slate-200 pt-3 text-[11px] leading-5 text-slate-400">
              Documento emitido pelo sistema Fotografando Olhares. Antes de uso
              externo, valide identificação profissional, assinatura e requisitos
              regulatórios aplicáveis.
            </p>
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

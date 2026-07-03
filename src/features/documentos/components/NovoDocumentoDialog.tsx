"use client";

import { useState } from "react";
import { ClipboardPlus, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
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
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import type { DocumentoClinicoType } from "@/shared/types";
import { documentoTipoLabel } from "../lib/documentos-labels";
import { markdownToHtml } from "../lib/documento-markdown";
import { documentoTemplates } from "../lib/documento-templates";
import {
  useCriarDocumentoClinico,
  usePacientesDocumento,
} from "../hooks/use-documentos";

const SEM_PACIENTE = "sem_paciente";

export function NovoDocumentoDialog() {
  const [open, setOpen] = useState(false);
  const [documentType, setDocumentType] =
    useState<DocumentoClinicoType>("exam_request");
  const [pacienteId, setPacienteId] = useState(SEM_PACIENTE);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: pacientes, isLoading: isLoadingPacientes } =
    usePacientesDocumento(open);
  const { mutate, isPending } = useCriarDocumentoClinico(() => {
    resetForm();
    setOpen(false);
  });

  const selectedTemplate = documentoTemplates[documentType];
  const selectedPaciente =
    pacienteId === SEM_PACIENTE
      ? null
      : pacientes?.find((paciente) => paciente.id === pacienteId);
  const previewTitle = title.trim() || selectedTemplate.title;
  const previewPaciente = selectedPaciente
    ? formatDisplayTextOrDash(selectedPaciente.nome_completo)
    : "Sem paciente vinculado";
  const previewContent = markdownToHtml(content);
  const isDirty =
    documentType !== "exam_request" ||
    pacienteId !== SEM_PACIENTE ||
    Boolean(title.trim()) ||
    Boolean(content.trim());
  const contentLength = content.trim().length;
  const contentLines = content.trim() ? content.trim().split("\n").length : 0;
  const quickSections =
    documentType === "exam_request"
      ? [
          "Exames solicitados:\n- ",
          "Indicação clínica:\n",
          "Orientações ao paciente:\n- ",
          "## Observações\n",
        ]
      : ["Prescrevo:\n1. ", "Modo de uso:\n", "Orientações:\n- ", "## Observações\n"];

  function resetForm() {
    setDocumentType("exam_request");
    setPacienteId(SEM_PACIENTE);
    setTitle("");
    setContent("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate({
      document_type: documentType,
      paciente_id: pacienteId === SEM_PACIENTE ? undefined : pacienteId,
      title,
      content,
    });
  }

  function applyTemplate(type = documentType) {
    const template = documentoTemplates[type];
    setTitle(template.title);
    setContent(template.content);
  }

  function appendSection(section: string) {
    setContent((currentContent) => {
      const separator = currentContent.trim() ? "\n\n" : "";
      return `${currentContent.trimEnd()}${separator}${section}`;
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) {
      return;
    }

    setOpen(nextOpen);
  }

  function handleTypeChange(value: DocumentoClinicoType) {
    setDocumentType(value);
    if (!title.trim() && !content.trim()) {
      applyTemplate(value);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-600 text-white hover:bg-cyan-500">
          <Plus className="h-4 w-4" />
          Novo documento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[94vh] w-[min(calc(100vw-2rem),1280px)] gap-0 overflow-hidden bg-white p-0 sm:max-w-[min(calc(100vw-2rem),1280px)]">
        <form
          onSubmit={handleSubmit}
          className="flex h-[min(94vh,860px)] max-h-[94vh] flex-col"
        >
          <DialogHeader className="border-b border-slate-200 px-5 py-4 pr-14">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50">
                <ClipboardPlus className="h-4 w-4 text-cyan-700" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-slate-800">
                  Novo documento clínico
                </DialogTitle>
                <DialogDescription>
                  Emita uma solicitação de exame ou receita branca simples.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_minmax(320px,0.85fr)]">
            <aside className="space-y-4 overflow-y-auto border-b border-slate-200 bg-slate-50/70 p-5 lg:border-r lg:border-b-0">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Tipo
                </label>
                <Select
                  value={documentType}
                  onValueChange={handleTypeChange}
                  disabled={isPending}
                >
                  <SelectTrigger className="h-10 w-full bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="exam_request">
                      {documentoTipoLabel.exam_request}
                    </SelectItem>
                    <SelectItem value="white_prescription">
                      {documentoTipoLabel.white_prescription}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Paciente
                </label>
                <Select
                  value={pacienteId}
                  onValueChange={setPacienteId}
                  disabled={isPending || isLoadingPacientes}
                >
                  <SelectTrigger className="h-10 w-full bg-white">
                    <SelectValue
                      placeholder={
                        isLoadingPacientes ? "Carregando..." : "Selecione"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value={SEM_PACIENTE}>Sem paciente</SelectItem>
                    {(pacientes ?? []).map((paciente) => (
                      <SelectItem key={paciente.id} value={paciente.id}>
                        {formatDisplayTextOrDash(paciente.nome_completo)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Título
                </label>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={selectedTemplate.title}
                  required
                  disabled={isPending}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-medium text-slate-500">
                  Montagem rápida
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate()}
                  disabled={isPending}
                  className="w-full justify-start bg-white"
                >
                  <Sparkles className="h-4 w-4 text-cyan-700" />
                  Aplicar modelo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                  disabled={isPending || !isDirty}
                  className="w-full justify-start bg-white"
                >
                  <Trash2 className="h-4 w-4 text-slate-500" />
                  Limpar rascunho
                </Button>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 transition-colors">
                <p className="text-xs text-slate-500">
                  {isPending
                    ? "Salvando documento..."
                    : isDirty
                      ? "Documento com alterações prontas para emitir."
                      : "Preencha os dados para emitir o documento."}
                </p>
              </div>
            </aside>

            <section className="flex min-h-0 min-w-0 flex-col p-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-medium text-slate-500">
                  Conteúdo em Markdown
                </label>
                <span className="text-xs text-slate-400">
                  {contentLength} caracteres · {contentLines} linhas
                </span>
              </div>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Use Markdown: ## Título, - item, **negrito**, *itálico*..."
                required
                disabled={isPending}
                className="min-h-0 flex-1 resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-800 shadow-xs outline-none transition-[color,box-shadow] placeholder:text-slate-400 focus-visible:border-cyan-500 focus-visible:ring-3 focus-visible:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="mt-3 grid shrink-0 grid-cols-2 gap-2 2xl:grid-cols-4">
                {quickSections.map((section) => (
                  <Button
                    key={section}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendSection(section)}
                    disabled={isPending}
                    className="min-w-0 justify-start bg-white text-slate-600"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="truncate">
                      {section.replace(/^#+\s*/, "").split(":")[0].trim()}
                    </span>
                  </Button>
                ))}
              </div>
              <p className="mt-2 shrink-0 text-xs text-slate-400">
                Markdown aceito: `## título` ou `##título`, `- item`, `1. item`,
                `**negrito**`, `*itálico*` e `código`.
              </p>
            </section>

            <section className="hidden min-h-0 min-w-0 flex-col border-l border-slate-200 bg-slate-50/70 p-5 xl:flex">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-slate-500">
                  Preview do documento
                </p>
                <span className="rounded-full border border-cyan-100 bg-cyan-50 px-2 py-0.5 text-xs font-medium text-cyan-700">
                  Markdown
                </span>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
                <p className="text-[11px] font-bold tracking-[0.08em] text-cyan-700 uppercase">
                  {documentoTipoLabel[documentType]}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">
                  {previewTitle}
                </h2>
                <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div>
                    <span className="block text-[10px] font-bold tracking-[0.06em] text-slate-400 uppercase">
                      Paciente
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-slate-700">
                      {previewPaciente}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold tracking-[0.06em] text-slate-400 uppercase">
                      Tipo
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-slate-700">
                      {documentoTipoLabel[documentType]}
                    </span>
                  </div>
                </div>
                <div
                  className="mt-5 text-sm leading-6 text-slate-700 [&_.empty]:text-slate-400 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:my-1 [&_ol]:mb-3 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_ul]:mb-3 [&_ul]:ml-5 [&_ul]:list-disc"
                  dangerouslySetInnerHTML={{ __html: previewContent }}
                />
              </div>
            </section>
          </div>

          <DialogFooter className="shrink-0 border-t border-slate-200 px-5 py-4">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-cyan-600 text-white hover:bg-cyan-500"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Emitir documento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

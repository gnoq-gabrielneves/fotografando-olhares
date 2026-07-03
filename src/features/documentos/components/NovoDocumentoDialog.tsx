"use client";

import { useState } from "react";
import { ClipboardPlus, Loader2, Plus } from "lucide-react";
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
    setOpen(false);
    setDocumentType("exam_request");
    setPacienteId(SEM_PACIENTE);
    setTitle("");
    setContent("");
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate({
      document_type: documentType,
      paciente_id: pacienteId === SEM_PACIENTE ? undefined : pacienteId,
      title,
      content,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-600 text-white hover:bg-cyan-500">
          <Plus className="h-4 w-4" />
          Novo documento
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[min(calc(100vw-2rem),520px)] gap-4 bg-white p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50">
              <ClipboardPlus className="h-4 w-4 text-cyan-700" />
            </div>
            <DialogTitle className="text-slate-800">
              Novo documento clínico
            </DialogTitle>
            <DialogDescription>
              Emita uma solicitação de exame ou receita branca simples.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Tipo</label>
              <Select
                value={documentType}
                onValueChange={(value: DocumentoClinicoType) =>
                  setDocumentType(value)
                }
                disabled={isPending}
              >
                <SelectTrigger className="h-10 bg-white">
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
                <SelectTrigger className="h-10 bg-white">
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
                placeholder="Ex: Solicitação de hemograma"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">
                Conteúdo
              </label>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Descreva exames, orientações ou prescrição..."
                required
                disabled={isPending}
                className="min-h-24 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs outline-none transition-[color,box-shadow] placeholder:text-slate-400 focus-visible:border-cyan-500 focus-visible:ring-3 focus-visible:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition-colors">
            <p className="text-xs text-slate-500">
              {isPending
                ? "Salvando documento..."
                : title || content
                  ? "Documento com alterações prontas para emitir."
                  : "Preencha os dados para emitir o documento."}
            </p>
          </div>

          <DialogFooter>
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

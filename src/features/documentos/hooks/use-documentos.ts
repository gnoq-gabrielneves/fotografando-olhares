"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib/query/keys";
import {
  criarDocumentoClinico,
  excluirDocumentoClinico,
  listarDocumentosClinicos,
  listarPacientesParaDocumento,
} from "../services/documentos.services";

export function useDocumentosClinicos() {
  return useQuery({
    queryKey: queryKeys.documentos.lista,
    queryFn: listarDocumentosClinicos,
  });
}

export function usePacientesDocumento(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.documentos.pacientes,
    queryFn: listarPacientesParaDocumento,
    enabled,
  });
}

export function useCriarDocumentoClinico(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: criarDocumentoClinico,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.documentos.lista,
      });
      toast.success("Documento emitido");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Erro ao emitir documento", { description: error.message });
    },
  });
}

export function useExcluirDocumentoClinico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: excluirDocumentoClinico,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.documentos.lista,
      });
      toast.success("Documento excluído");
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir documento", {
        description: error.message,
      });
    },
  });
}

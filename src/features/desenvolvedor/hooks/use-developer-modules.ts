"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib/query/keys";
import {
  atualizarOrganizacao,
  atualizarModuloDaOrganizacao,
  criarModuloClinico,
  criarOrganizacao,
  listarModulosPorOrganizacao,
} from "../services/developer-modules.services";

export function useDeveloperModules() {
  return useQuery({
    queryKey: queryKeys.desenvolvedor.modulos,
    queryFn: listarModulosPorOrganizacao,
  });
}

export function useAtualizarModuloOrganizacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: atualizarModuloDaOrganizacao,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.desenvolvedor.modulos,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.modulos.organizacaoAtual,
        }),
      ]);
      toast.success("Licença atualizada");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar licença", { description: error.message });
    },
  });
}

export function useCriarOrganizacao(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: criarOrganizacao,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.desenvolvedor.modulos,
        }),
        queryClient.invalidateQueries({
          queryKey: ["organizacoes", "lista"],
        }),
      ]);
      toast.success("Organização criada");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar organização", { description: error.message });
    },
  });
}

export function useAtualizarOrganizacao(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: atualizarOrganizacao,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.desenvolvedor.modulos,
        }),
        queryClient.invalidateQueries({
          queryKey: ["organizacoes", "lista"],
        }),
      ]);
      toast.success("Organização atualizada");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar organização", {
        description: error.message,
      });
    },
  });
}

export function useCriarModuloClinico(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: criarModuloClinico,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.desenvolvedor.modulos,
      });
      toast.success("Módulo clínico criado");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar módulo", { description: error.message });
    },
  });
}

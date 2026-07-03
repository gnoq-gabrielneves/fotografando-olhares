"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/shared/lib/query/keys";
import {
  getClinicalSettings,
  salvarClinicalSettings,
} from "../services/clinical-settings.services";

export function useClinicalSettings() {
  return useQuery({
    queryKey: queryKeys.configuracoes.clinicas,
    queryFn: getClinicalSettings,
  });
}

export function useSalvarClinicalSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salvarClinicalSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.configuracoes.clinicas,
      });
      toast.success("Configurações salvas");
    },
    onError: (error: Error) => {
      toast.error("Erro ao salvar configurações", {
        description: error.message,
      });
    },
  });
}


import { queryKeys } from "@/shared/lib/query/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { atualizarPerfil } from "../services/profile.services";

export function useAtualizarPerfil(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: atualizarPerfil,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      toast.success("Perfil atualizado com sucesso!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar perfil", { description: error.message });
    },
  });
}

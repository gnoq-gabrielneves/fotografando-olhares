import {
  atualizarUsuario,
  criarUsuario,
  excluirUsuario,
  listarOrganizacoes,
  listarUsuarios,
} from "@/features/usuarios/services/usuarios.services";
import { queryKeys } from "@/shared/lib/query/keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUsuarios() {
  return useQuery({
    queryKey: queryKeys.usuarios.lista,
    queryFn: listarUsuarios,
  });
}

export function useOrganizacoes(enabled: boolean) {
  return useQuery({
    queryKey: ["organizacoes", "lista"],
    queryFn: listarOrganizacoes,
    enabled,
  });
}

export function useCriarUsuario(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: criarUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.usuarios.lista });
      toast.success("Usuário criado com sucesso!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar usuário", { description: error.message });
    },
  });
}

export function useExcluirUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: excluirUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.usuarios.lista });
      toast.success("Usuário excluído com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir usuário", { description: error.message });
    },
  });
}

export function useAtualizarUsuario(id: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof atualizarUsuario>[1]) =>
      atualizarUsuario(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.usuarios.lista });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      toast.success("Usuário atualizado com sucesso!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar usuário", { description: error.message });
    },
  });
}

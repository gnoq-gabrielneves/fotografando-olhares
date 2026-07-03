import {
  atualizarUsuario,
  criarUsuario,
  excluirUsuario,
  listarOrganizacoes,
  listarUsuarios,
} from "@/features/usuarios/services/usuarios.services";
import { useProfile } from "@/shared/hooks/use-profile";
import { getOrganizationOverrideId } from "@/shared/lib/organization/current-client";
import { queryKeys } from "@/shared/lib/query/keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUsuarios() {
  const { profile } = useProfile();
  const selectedOrganizationId =
    profile?.role === "developer"
      ? getOrganizationOverrideId() || profile.organization_id
      : profile?.organization_id;

  return useQuery({
    queryKey: queryKeys.usuarios.lista(selectedOrganizationId),
    queryFn: () => listarUsuarios(selectedOrganizationId),
    enabled: !!profile,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.usuarios.all });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.usuarios.all });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.usuarios.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      toast.success("Usuário atualizado com sucesso!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar usuário", { description: error.message });
    },
  });
}

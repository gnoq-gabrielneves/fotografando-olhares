import { FiltrosLaudos } from "@/features/laudos/laudo-types";
import { getLaudos } from "@/features/laudos/services/getLaudos";
import {
  criarLaudo,
  NovoLaudoInput,
} from "@/features/pacientes/services/pacientes.services";
import { queryKeys } from "@/shared/lib/query/keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLaudos(filtros: FiltrosLaudos = {}) {
  return useQuery({
    queryKey: queryKeys.laudos.lista(filtros),
    queryFn: () => getLaudos(filtros),
  });
}

export function useCriarLaudo(pacienteId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NovoLaudoInput) => criarLaudo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pacientes.byId(pacienteId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.pacientes.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.laudos.byPaciente(pacienteId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.metricas });
      queryClient.invalidateQueries({
        queryKey: queryKeys.home.ultimosPacientes,
      });
      toast.success("Laudo registrado com sucesso!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Erro ao registrar laudo", { description: error.message });
    },
  });
}

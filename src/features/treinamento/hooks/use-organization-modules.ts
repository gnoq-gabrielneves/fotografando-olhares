"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query/keys";
import { getModulosDaOrganizacaoAtual } from "../services/module-services";

export function useOrganizationModules() {
  return useQuery({
    queryKey: queryKeys.modulos.organizacaoAtual,
    queryFn: getModulosDaOrganizacaoAtual,
  });
}

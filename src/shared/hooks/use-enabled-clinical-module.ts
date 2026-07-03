"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query/keys";
import type { ClinicalModuleId } from "@/shared/lib/modules/clinical-modules";
import { getCurrentOrganizationModules } from "@/shared/services/organization-modules.services";

export function useEnabledClinicalModules() {
  return useQuery({
    queryKey: queryKeys.modulos.organizacaoAtual,
    queryFn: getCurrentOrganizationModules,
  });
}

export function useEnabledClinicalModule(moduleId: ClinicalModuleId) {
  const query = useEnabledClinicalModules();

  const isEnabled = useMemo(
    () =>
      query.data?.some(
        (module) => module.module_id === moduleId && module.status === "active",
      ) ?? false,
    [moduleId, query.data],
  );

  return {
    ...query,
    isEnabled,
  };
}

"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query/keys";
import type { ClinicalModuleId } from "@/shared/lib/modules/clinical-modules";
import { getCurrentOrganizationModules } from "@/shared/services/organization-modules.services";
import { useProfile } from "./use-profile";

export function useEnabledClinicalModules() {
  return useQuery({
    queryKey: queryKeys.modulos.organizacaoAtual,
    queryFn: getCurrentOrganizationModules,
  });
}

export function useEnabledClinicalModule(moduleId: ClinicalModuleId) {
  const query = useEnabledClinicalModules();
  const { profile, isLoading: isLoadingProfile } = useProfile();
  const isDeveloper = profile?.role === "developer";

  const isEnabled = useMemo(
    () =>
      isDeveloper ||
      (query.data?.some(
        (module) => module.module_id === moduleId && module.status === "active",
      ) ??
        false),
    [isDeveloper, moduleId, query.data],
  );

  return {
    ...query,
    isEnabled,
    isLoading: query.isLoading || isLoadingProfile,
    isDeveloper,
  };
}

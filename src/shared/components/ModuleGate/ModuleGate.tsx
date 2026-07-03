"use client";

import type { ReactNode } from "react";
import { LockKeyhole, Loader2 } from "lucide-react";
import { EmptyState } from "@/shared/components/states/EmptyState";
import { useEnabledClinicalModule } from "@/shared/hooks/use-enabled-clinical-module";
import { useProfile } from "@/shared/hooks/use-profile";
import {
  clinicalModules,
  type ClinicalModuleId,
} from "@/shared/lib/modules/clinical-modules";

type ModuleGateProps = {
  moduleId: ClinicalModuleId;
  children: ReactNode;
};

export function ModuleGate({ moduleId, children }: ModuleGateProps) {
  const { profile, isLoading: isLoadingProfile } = useProfile();
  const { isEnabled, isLoading: isLoadingModule } =
    useEnabledClinicalModule(moduleId);
  const clinicalModule = clinicalModules[moduleId];
  const isDeveloper = profile?.role === "developer";

  if (isDeveloper) {
    return children;
  }

  if (isLoadingProfile || isLoadingModule) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Carregando licença...
      </div>
    );
  }

  if (!isEnabled) {
    return (
      <EmptyState
        icon={LockKeyhole}
        title="Módulo não habilitado"
        description={`O módulo ${clinicalModule.name} não está ativo para esta organização.`}
        className="min-h-[320px]"
      />
    );
  }

  return children;
}

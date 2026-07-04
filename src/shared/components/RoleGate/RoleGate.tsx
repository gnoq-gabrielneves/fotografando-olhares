"use client";

import type { ReactNode } from "react";
import { LockKeyhole, Loader2 } from "lucide-react";
import { EmptyState } from "@/shared/components/states/EmptyState";
import { useProfile } from "@/shared/hooks/use-profile";
import type { UserRole } from "@/shared/types";

type RoleGateProps = {
  allowedRoles: UserRole[];
  children: ReactNode;
};

export function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const { profile, isLoading } = useProfile();
  const canAccess = profile?.role && allowedRoles.includes(profile.role);

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Verificando permissões...
      </div>
    );
  }

  if (!canAccess) {
    return (
      <EmptyState
        icon={LockKeyhole}
        title="Acesso restrito"
        description="Essa área está disponível apenas para administradores da organização."
        className="min-h-[320px]"
      />
    );
  }

  return children;
}


"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useProfile } from "@/shared/hooks/use-profile";
import {
  getOrganizationOverrideId,
  setOrganizationOverrideId,
} from "@/shared/lib/organization/current-client";
import { queryKeys } from "@/shared/lib/query/keys";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import { useOrganizacoes } from "@/features/usuarios/hooks/use-users";
import { useQueryClient } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import { useState } from "react";

export function OrganizationSwitcher() {
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const isDeveloper = profile?.role === "developer";
  const { data: organizations } = useOrganizacoes(isDeveloper);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(
    () => getOrganizationOverrideId() ?? "",
  );
  const currentOrganizationId =
    selectedOrganizationId || profile?.organization_id || "";

  if (!isDeveloper || !organizations?.length) return null;

  function handleChange(organizationId: string) {
    setSelectedOrganizationId(organizationId);
    setOrganizationOverrideId(organizationId);
    queryClient.invalidateQueries();
    queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
  }

  return (
    <div className="px-2 pb-3">
      <div className="flex items-center gap-2 px-2 pb-1.5 text-[0.68rem] font-medium uppercase tracking-wider text-slate-400">
        <Building2 className="h-3.5 w-3.5" />
        Organização
      </div>
      <Select value={currentOrganizationId} onValueChange={handleChange}>
        <SelectTrigger className="h-9 w-full border-slate-200 bg-white text-xs text-slate-700 shadow-sm">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent className="bg-white border-slate-200 text-slate-700" position="popper">
          {organizations.map((organization) => (
            <SelectItem key={organization.id} value={organization.id}>
              {formatDisplayTextOrDash(organization.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

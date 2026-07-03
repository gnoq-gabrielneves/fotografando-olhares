"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { EmptyState, QueryErrorState } from "@/shared/components/states/EmptyState";
import { Button } from "@/shared/components/ui/button";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import {
  useAtualizarModuloOrganizacao,
  useDeveloperModules,
} from "../hooks/use-developer-modules";
import { CreateClinicalModuleDialog } from "./CreateClinicalModuleDialog";
import { OrganizationDialog } from "./OrganizationDialog";

export function DeveloperModulesManager() {
  const { data, error, isError, isLoading } = useDeveloperModules();
  const { mutate, isPending, variables } = useAtualizarModuloOrganizacao();
  const [openOrganizationIds, setOpenOrganizationIds] = useState<Set<string>>(
    () => new Set(),
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 h-5 w-56 animate-pulse rounded bg-slate-100" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-20 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <QueryErrorState message={error.message} />;
  }

  if (!data?.organizations.length) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <OrganizationDialog mode="create" />
        </div>
        <EmptyState
          title="Nenhuma organização encontrada"
          description="Cadastre organizações antes de atribuir módulos clínicos."
        />
      </div>
    );
  }

  if (!data.clinicalModules.length) {
    return (
      <EmptyState
        title="Nenhum módulo clínico encontrado"
        description="Adicione módulos ao catálogo para começar a montar licenças."
      />
    );
  }

  function isModuleEnabled(organizationId: string, clinicalModuleId: string) {
    return data?.organizationModules.some(
      (item) =>
        item.organization_id === organizationId &&
        item.module_id === clinicalModuleId &&
        item.status === "active",
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Organizações
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Crie instituições clientes e defina quais módulos fazem parte da licença.
          </p>
        </div>
        <OrganizationDialog mode="create" />
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="flex min-h-32 flex-col justify-between rounded-xl border border-dashed border-slate-300 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Catálogo de módulos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Cadastre especialidades para vender por licença.
            </p>
          </div>
          <div className="mt-4">
            <CreateClinicalModuleDialog />
          </div>
        </article>

        {data.clinicalModules.map((clinicalModule) => (
          <article
            key={clinicalModule.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50">
                <ShieldCheck className="h-4 w-4 text-cyan-700" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  {clinicalModule.name}
                </h2>
                <p className="text-xs font-medium text-cyan-700">
                  {clinicalModule.specialty}
                </p>
              </div>
            </div>
            {clinicalModule.description ? (
              <p className="text-sm text-slate-500">
                {clinicalModule.description}
              </p>
            ) : null}
          </article>
        ))}
      </section>

      <section className="space-y-3">
        {data.organizations.map((organization) => {
          const isOpen = openOrganizationIds.has(organization.id);
          const enabledCount = data.clinicalModules.filter((clinicalModule) =>
            isModuleEnabled(organization.id, clinicalModule.id),
          ).length;

          function toggleOrganization() {
            setOpenOrganizationIds((current) => {
              const next = new Set(current);
              if (next.has(organization.id)) {
                next.delete(organization.id);
              } else {
                next.add(organization.id);
              }
              return next;
            });
          }

          return (
            <article
              key={organization.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={toggleOrganization}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-800">
                      {formatDisplayTextOrDash(organization.name)}
                    </span>
                    <span className="block truncate text-xs text-slate-400">
                      {organization.slug}
                    </span>
                  </span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 ring-1 ring-cyan-100">
                    {enabledCount} módulo{enabledCount === 1 ? "" : "s"}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                    {organization.status === "active" ? "Ativa" : "Inativa"}
                  </span>
                  <OrganizationDialog mode="edit" organization={organization} />
                </div>
              </div>

              {isOpen ? (
                <div className="border-t border-slate-100 p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {data.clinicalModules.map((clinicalModule) => {
                      const enabled = isModuleEnabled(
                        organization.id,
                        clinicalModule.id,
                      );
                      const currentToggle =
                        variables?.organization_id === organization.id &&
                        variables?.module_id === clinicalModule.id;

                      return (
                        <div
                          key={clinicalModule.id}
                          className="rounded-lg border border-slate-200 p-3"
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {clinicalModule.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                {clinicalModule.specialty}
                              </p>
                            </div>
                            {enabled ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-slate-300" />
                            )}
                          </div>

                          <Button
                            type="button"
                            variant={enabled ? "outline" : "default"}
                            size="sm"
                            disabled={isPending}
                            onClick={() =>
                              mutate({
                                organization_id: organization.id,
                                module_id: clinicalModule.id,
                                enabled: !enabled,
                              })
                            }
                            className={
                              enabled
                                ? "h-8 w-full border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                : "h-8 w-full bg-cyan-600 text-white hover:bg-cyan-500"
                            }
                          >
                            {isPending && currentToggle ? (
                              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            ) : null}
                            {enabled ? "Desabilitar" : "Habilitar"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}

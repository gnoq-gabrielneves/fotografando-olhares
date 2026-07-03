"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { activeClinicalModule } from "@/shared/lib/modules/clinical-modules";
import { useOrganizationModules } from "../hooks/use-organization-modules";

export function EnabledModulesPanel() {
  const { data, error, isError, isLoading } = useOrganizationModules();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-cyan-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-cyan-100" />
            <div className="h-3 w-full max-w-xl animate-pulse rounded bg-cyan-100" />
            <div className="h-3 w-32 animate-pulse rounded bg-cyan-100" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-white">
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Não foi possível carregar os módulos da licença
            </p>
            <p className="mt-1 text-sm text-red-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const moduleRows = data?.length
    ? data
    : [
        {
          module_id: activeClinicalModule.id,
          clinical_modules: {
            id: activeClinicalModule.id,
            name: activeClinicalModule.name,
            specialty: activeClinicalModule.specialty,
            description: activeClinicalModule.description,
            status: "active",
          },
        },
      ];

  return (
    <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Módulos habilitados na licença
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Cada organização poderá ter módulos clínicos diferentes.
          </p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-cyan-700 ring-1 ring-cyan-100">
          {moduleRows.length} ativo{moduleRows.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {moduleRows.map((row) => {
          const clinicalModule = row.clinical_modules;
          const isOftalmo = row.module_id === activeClinicalModule.id;
          const Icon = isOftalmo ? activeClinicalModule.icon : CheckCircle2;

          return (
            <article
              key={row.module_id}
              className="rounded-lg border border-cyan-100 bg-white p-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50">
                  <Icon className="h-4 w-4 text-cyan-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {clinicalModule?.name ?? row.module_id}
                  </p>
                  <p className="text-xs font-medium text-cyan-700">
                    {clinicalModule?.specialty ?? "Especialidade"}
                  </p>
                  {clinicalModule?.description ? (
                    <p className="mt-1 text-sm text-slate-500">
                      {clinicalModule.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

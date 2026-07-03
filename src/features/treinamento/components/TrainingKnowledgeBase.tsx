"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  PATIENT_STATUS_DESCRIPTIONS,
  TRAINING_FORMULAS,
  TRAINING_WORKFLOWS,
} from "@/shared/lib/clinical/rules";
import {
  getPacienteStatusBadge,
  getPacienteStatusLabel,
} from "@/shared/lib/utils/paciente-status";
import {
  PACIENTE_STATUS_OPERACIONAIS,
  type PacienteStatusOperacional,
} from "@/shared/types";
import { EnabledModulesPanel } from "./EnabledModulesPanel";

type TrainingSection = "fluxo" | "status" | "calculos";

type SearchableItem =
  | {
      section: "fluxo";
      key: string;
      title: string;
      body: string;
      icon: (typeof TRAINING_WORKFLOWS)[number]["icon"];
      items: string[];
    }
  | {
      section: "status";
      key: PacienteStatusOperacional;
      title: string;
      body: string;
      status: PacienteStatusOperacional;
    }
  | {
      section: "calculos";
      key: string;
      title: string;
      body: string;
      icon: (typeof TRAINING_FORMULAS)[number]["icon"];
    };

const sectionOptions = [
  { value: "fluxo", label: "Fluxo" },
  { value: "status", label: "Status" },
  { value: "calculos", label: "Cálculos" },
] as const satisfies readonly { value: TrainingSection; label: string }[];

const searchableItems: SearchableItem[] = [
  ...TRAINING_WORKFLOWS.map((workflow) => ({
    section: "fluxo" as const,
    key: workflow.title,
    title: workflow.title,
    body: workflow.items.join(" "),
    icon: workflow.icon,
    items: workflow.items,
  })),
  ...PACIENTE_STATUS_OPERACIONAIS.map((status) => ({
    section: "status" as const,
    key: status,
    title: getPacienteStatusLabel(status),
    body: PATIENT_STATUS_DESCRIPTIONS[status],
    status,
  })),
  ...TRAINING_FORMULAS.map((formula) => ({
    section: "calculos" as const,
    key: formula.name,
    title: formula.name,
    body: formula.value,
    icon: formula.icon,
  })),
];

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function FlowCard({ item }: { item: Extract<SearchableItem, { section: "fluxo" }> }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50">
          <item.icon className="h-4 w-4 text-cyan-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">{item.title}</h3>
      </div>
      <ul className="space-y-3">
        {item.items.map((entry) => (
          <li key={entry} className="flex gap-2 text-sm text-slate-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
            <span>{entry}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function StatusRow({ item }: { item: Extract<SearchableItem, { section: "status" }> }) {
  return (
    <div className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[220px_1fr]">
      <div>
        <span
          className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${getPacienteStatusBadge(item.status)}`}
        >
          {item.title}
        </span>
      </div>
      <p className="text-sm text-slate-600">{item.body}</p>
    </div>
  );
}

function FormulaCard({
  item,
}: {
  item: Extract<SearchableItem, { section: "calculos" }>;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-100 bg-violet-50">
          <item.icon className="h-4 w-4 text-violet-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">{item.title}</h3>
      </div>
      <p className="text-sm text-slate-600">{item.body}</p>
    </article>
  );
}

export function TrainingKnowledgeBase() {
  const [section, setSection] = useState<TrainingSection>("fluxo");
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const term = normalizeSearch(search);

    return searchableItems.filter((item) => {
      if (item.section !== section) return false;
      if (!term) return true;

      return normalizeSearch(`${item.title} ${item.body}`).includes(term);
    });
  }, [search, section]);

  const flowItems = filteredItems.filter(
    (item): item is Extract<SearchableItem, { section: "fluxo" }> =>
      item.section === "fluxo",
  );
  const statusItems = filteredItems.filter(
    (item): item is Extract<SearchableItem, { section: "status" }> =>
      item.section === "status",
  );
  const formulaItems = filteredItems.filter(
    (item): item is Extract<SearchableItem, { section: "calculos" }> =>
      item.section === "calculos",
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex w-full rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:w-fit">
          {sectionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSection(option.value)}
              className={`h-8 flex-1 rounded-lg px-3 text-sm font-medium transition-colors sm:flex-none ${
                section === option.value
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar na documentação"
            className="h-10 bg-white pl-9"
          />
        </div>
      </div>

      <EnabledModulesPanel />

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400 shadow-sm">
          Nenhum conteúdo encontrado para a busca atual.
        </div>
      ) : null}

      {section === "fluxo" && flowItems.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {flowItems.map((item) => (
            <FlowCard key={item.key} item={item} />
          ))}
        </section>
      ) : null}

      {section === "status" && statusItems.length > 0 ? (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            {statusItems.map((item) => (
              <StatusRow key={item.key} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {section === "calculos" && formulaItems.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {formulaItems.map((item) => (
            <FormulaCard key={item.key} item={item} />
          ))}
        </section>
      ) : null}
    </div>
  );
}

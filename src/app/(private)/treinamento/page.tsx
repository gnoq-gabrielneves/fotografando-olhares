import type { Metadata } from "next";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import {
  PATIENT_STATUS_DESCRIPTIONS,
  TRAINING_FORMULAS,
  TRAINING_WORKFLOWS,
} from "@/shared/lib/clinical/rules";
import {
  getPacienteStatusBadge,
  getPacienteStatusLabel,
} from "@/shared/lib/utils/paciente-status";
import { PACIENTE_STATUS_OPERACIONAIS } from "@/shared/types";
import { BookOpen, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Treinamento | Fotografando Olhares",
  description: "Documentação operacional do sistema Fotografando Olhares.",
};

export default function TreinamentoPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        icon={BookOpen}
        title="Treinamento"
        description="Documentação operacional e memórias de cálculo do sistema"
      />

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Fluxo de uso
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {TRAINING_WORKFLOWS.map((workflow) => (
            <article
              key={workflow.title}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50">
                  <workflow.icon className="h-4 w-4 text-cyan-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">
                  {workflow.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {workflow.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Status operacionais
        </h2>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {PACIENTE_STATUS_OPERACIONAIS.map((status) => (
              <div
                key={status}
                className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 px-5 py-4"
              >
                <div>
                  <span
                    className={`inline-flex text-xs px-2.5 py-1 rounded-md font-medium border ${getPacienteStatusBadge(status)}`}
                  >
                  {getPacienteStatusLabel(status)}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  {PATIENT_STATUS_DESCRIPTIONS[status]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Memórias de cálculo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TRAINING_FORMULAS.map((formula) => (
            <article
              key={formula.name}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-100 bg-violet-50">
                  <formula.icon className="h-4 w-4 text-violet-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">
                  {formula.name}
                </h3>
              </div>
              <p className="text-sm text-slate-600">{formula.value}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

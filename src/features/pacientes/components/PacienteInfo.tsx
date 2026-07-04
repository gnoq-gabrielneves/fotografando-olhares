import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import {
  formatDateTimeToBrazilian,
  formatIsoDateToBrazilian,
} from "@/shared/lib/format/date";
import type { PacienteDetalhado } from "@/shared/types";
import {
  Activity,
  ClipboardCheck,
  Eye,
  FileHeart,
  MapPinned,
  Pill,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  paciente: PacienteDetalhado;
  hasOftalmo: boolean;
};

type InfoItem = {
  label: string;
  value: string | null | undefined;
};

function formatarData(data: string | null) {
  return formatDateTimeToBrazilian(data);
}

function formatarDataCivil(data: string | null) {
  return formatIsoDateToBrazilian(data);
}

function boolLabel(value: boolean | null | undefined) {
  if (value === null || value === undefined) return "—";
  return value ? "Sim" : "Não";
}

function boolClass(value: boolean | null | undefined) {
  if (value === null || value === undefined) {
    return "border-slate-200 bg-slate-100 text-slate-500";
  }

  return value
    ? "border-cyan-200 bg-cyan-50 text-cyan-700"
    : "border-slate-200 bg-slate-100 text-slate-500";
}

function SectionCard({
  icon: Icon,
  title,
  children,
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300 ${className}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50 text-cyan-700">
          <Icon className="size-4" />
        </span>
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoGrid({ items }: { items: InfoItem[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
        >
          <dt className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm font-medium text-slate-800">
            {formatDisplayTextOrDash(item.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function BoolGrid({
  items,
}: {
  items: Array<{ label: string; value: boolean | null | undefined }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
        >
          <span className="text-sm text-slate-600">{item.label}</span>
          <span
            className={`rounded-md border px-2 py-0.5 text-xs font-medium ${boolClass(item.value)}`}
          >
            {boolLabel(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function TextBlock({ title, content }: { title: string; content: string }) {
  return (
    <SectionCard icon={FileHeart} title={title} className="lg:col-span-2">
      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
        {content}
      </p>
    </SectionCard>
  );
}

export function PacienteInfo({ paciente, hasOftalmo }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SectionCard icon={UserRound} title="Identificação">
        <InfoGrid
          items={[
            { label: "CPF / CNS", value: paciente.cpf_cns },
            { label: "Prontuário", value: paciente.prontuario },
            {
              label: "Data de nascimento",
              value: formatarDataCivil(paciente.data_nascimento),
            },
            {
              label: "Responsável",
              value: paciente.profiles?.full_name,
            },
          ]}
        />
      </SectionCard>

      <SectionCard icon={MapPinned} title="Atendimento">
        <InfoGrid
          items={[
            {
              label: "Local",
              value: paciente.locais_atendimento?.nome,
            },
            { label: "Zona", value: paciente.zona },
            {
              label: "Cadastrado em",
              value: formatarData(paciente.created_at),
            },
            ...(hasOftalmo
              ? []
              : [
                  {
                    label: "Módulo clínico",
                    value: "Básico",
                  },
                ]),
          ]}
        />
      </SectionCard>

      <SectionCard icon={Activity} title="Hábitos e contexto">
        <BoolGrid
          items={[
            { label: "Tabagista", value: paciente.tabagista },
            { label: "Atividade física", value: paciente.atividade_fisica },
          ]}
        />
      </SectionCard>

      {hasOftalmo ? (
        <SectionCard
          icon={Eye}
          title="Oftalmologia"
          className="animate-in fade-in-0 slide-in-from-top-1"
        >
          <div className="space-y-3">
            <InfoGrid
              items={[
                {
                  label: "Tempo de diagnóstico DM",
                  value: paciente.tempo_diagnostico_dm,
                },
                {
                  label: "Tempo de diagnóstico HAS",
                  value: paciente.tempo_diagnostico_has,
                },
                { label: "Acuidade visual OD", value: paciente.av_od },
                { label: "Acuidade visual OE", value: paciente.av_oe },
                {
                  label: "Último exame oftalmológico",
                  value: paciente.qt_tempo_ultimo_exame,
                },
              ]}
            />
            <BoolGrid
              items={[
                { label: "Usa insulina", value: paciente.insulina },
                {
                  label: "Fez exame oftalmológico",
                  value: paciente.fez_exame_oftalmologico,
                },
              ]}
            />
          </div>
        </SectionCard>
      ) : (
        <SectionCard icon={ClipboardCheck} title="Prontuário geral">
          <p className="text-sm leading-6 text-slate-500">
            Esta organização está usando apenas o cadastro clínico básico deste
            paciente. Campos de especialidade aparecem quando um módulo clínico
            é ativado.
          </p>
        </SectionCard>
      )}

      {paciente.medicamentos_em_uso ? (
        <TextBlock
          title="Medicamentos em uso"
          content={paciente.medicamentos_em_uso}
        />
      ) : null}

      {paciente.outras_obs ? (
        <TextBlock title="Observações" content={paciente.outras_obs} />
      ) : null}

      {!paciente.medicamentos_em_uso && !paciente.outras_obs ? (
        <SectionCard icon={Pill} title="Anotações clínicas" className="lg:col-span-2">
          <p className="text-sm text-slate-500">
            Nenhum medicamento ou observação adicional registrado.
          </p>
        </SectionCard>
      ) : null}
    </div>
  );
}

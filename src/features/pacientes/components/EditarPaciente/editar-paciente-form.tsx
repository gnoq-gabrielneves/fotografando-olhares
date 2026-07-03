"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  formatIsoDateToBrazilian,
  parseBrazilianDateToIso,
} from "@/shared/lib/format/date";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { queryKeys } from "@/shared/lib/query/keys";
import { useEnabledClinicalModule } from "@/shared/hooks/use-enabled-clinical-module";
import { getPacienteStatusLabel } from "@/shared/lib/utils/paciente-status";
import {
  PACIENTE_STATUS_OPERACIONAIS,
  PacienteDetalhado,
  type PacienteStatusOperacional,
} from "@/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";
import {
  atualizarPaciente,
  getLocaisAtendimento,
} from "../../services/pacientes.services";

type FormData = {
  nome_completo: string;
  sexo: "M" | "F" | "";
  cpf_cns: string;
  data_nascimento: string;
  local_atendimento_id: string;
  prontuario: string;
  medicamentos_em_uso: string;
  insulina: boolean;
  tempo_diagnostico_dm: string;
  tempo_diagnostico_has: string;
  zona: string;
  fez_exame_oftalmologico: boolean;
  tabagista: boolean;
  atividade_fisica: boolean;
  av_od: string;
  av_oe: string;
  outras_obs: string;
  status_operacional: PacienteStatusOperacional;
};

type Props = {
  paciente: PacienteDetalhado;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-medium text-cyan-600 uppercase tracking-wider whitespace-nowrap">
        {children}
      </span>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

function formatarDataParaExibicao(data: string | null) {
  return formatIsoDateToBrazilian(data) ?? "";
}

function getInitialForm(paciente: PacienteDetalhado): FormData {
  return {
    nome_completo: paciente.nome_completo ?? "",
    sexo: paciente.sexo ?? "",
    cpf_cns: paciente.cpf_cns ?? "",
    data_nascimento: paciente.data_nascimento ?? "",
    local_atendimento_id: paciente.local_atendimento_id ?? "",
    prontuario: paciente.prontuario ?? "",
    medicamentos_em_uso: paciente.medicamentos_em_uso ?? "",
    insulina: paciente.insulina ?? false,
    tempo_diagnostico_dm: paciente.tempo_diagnostico_dm ?? "",
    tempo_diagnostico_has: paciente.tempo_diagnostico_has ?? "",
    zona: paciente.zona ?? "",
    fez_exame_oftalmologico: paciente.fez_exame_oftalmologico ?? false,
    tabagista: paciente.tabagista ?? false,
    atividade_fisica: paciente.atividade_fisica ?? false,
    av_od: paciente.av_od ?? "",
    av_oe: paciente.av_oe ?? "",
    outras_obs: paciente.outras_obs ?? "",
    status_operacional: paciente.status_operacional ?? "cadastrado",
  };
}

const inputClass =
  "w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-md px-3 h-10 text-sm outline-none";
const labelClass = "text-slate-600 text-xs mb-1.5 block";
const errClass = "text-red-500 text-xs mt-1";
const selectClass =
  "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-cyan-500 h-10 w-full";

export function EditarPacienteForm({ paciente }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const initialForm = getInitialForm(paciente);
  const [form, setForm] = useState<FormData>(initialForm);

  const [erros, setErros] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const { data: locais } = useQuery({
    queryKey: ["locais_atendimento"],
    queryFn: getLocaisAtendimento,
  });
  const { isEnabled: hasOftalmo, isLoading: isLoadingModules } =
    useEnabledClinicalModule("oftalmo");

  const { mutate, isPending } = useMutation({
    mutationFn: (data: Partial<FormData>) => {
      const basePayload = {
        nome_completo: data.nome_completo,
        sexo: data.sexo as "M" | "F",
        cpf_cns: data.cpf_cns || undefined,
        data_nascimento: data.data_nascimento || undefined,
        local_atendimento_id: data.local_atendimento_id || undefined,
        prontuario: data.prontuario || undefined,
        medicamentos_em_uso: data.medicamentos_em_uso || undefined,
        tabagista: data.tabagista,
        atividade_fisica: data.atividade_fisica,
        outras_obs: data.outras_obs || undefined,
        zona: (data.zona as "Urbana" | "Rural" | "Periurbana") || undefined,
      };

      return atualizarPaciente(paciente.id, {
        ...basePayload,
        ...(hasOftalmo
          ? {
              status_operacional:
                data.status_operacional as PacienteStatusOperacional,
              insulina: data.insulina,
              tempo_diagnostico_dm:
                (data.tempo_diagnostico_dm as
                  | "<1 ano"
                  | "1 a 5 anos"
                  | "5 a 10 anos"
                  | ">10 anos") || undefined,
              tempo_diagnostico_has:
                (data.tempo_diagnostico_has as
                  | "<1 ano"
                  | "1 a 5 anos"
                  | "5 a 10 anos"
                  | ">10 anos") || undefined,
              fez_exame_oftalmologico: data.fez_exame_oftalmologico,
              av_od: data.av_od || undefined,
              av_oe: data.av_oe || undefined,
            }
          : {}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pacientes.byId(paciente.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.pacientes.all });
      toast.success("Paciente atualizado com sucesso!");
      router.push(`/pacientes/${paciente.id}`);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar paciente", { description: error.message });
    },
  });

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErros((prev) => ({ ...prev, [key]: undefined }));
  }

  function validar() {
    const novosErros: Partial<Record<keyof FormData, string>> = {};
    if (!form.nome_completo || form.nome_completo.length < 3)
      novosErros.nome_completo = "Nome deve ter ao menos 3 caracteres";
    if (!form.sexo) novosErros.sexo = "Selecione o sexo";
    return novosErros;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }
    mutate(form);
  }

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-8">
      {/* Dados pessoais */}
      <div className="space-y-4">
        <SectionTitle>Dados pessoais</SectionTitle>

        <div className="space-y-1.5">
          <label className={labelClass}>Nome completo *</label>
          <Input
            value={form.nome_completo}
            onChange={(e) => set("nome_completo", e.target.value)}
            placeholder="Nome completo do paciente"
            className={selectClass}
          />
          {erros.nome_completo && (
            <p className={errClass}>{erros.nome_completo}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Sexo *</label>
            <Select
              value={form.sexo}
              onValueChange={(v) => set("sexo", v as "M" | "F")}
            >
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-700">
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
              </SelectContent>
            </Select>
            {erros.sexo && <p className={errClass}>{erros.sexo}</p>}
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Data de nascimento</label>
            <IMaskInput
              mask="00/00/0000"
              placeholder="DD/MM/AAAA"
              value={formatarDataParaExibicao(form.data_nascimento)}
              className={inputClass}
              onAccept={(value: string) => {
                set("data_nascimento", parseBrazilianDateToIso(value));
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClass}>CPF / CNS</label>
            <IMaskInput
              mask="000.000.000-00"
              placeholder="000.000.000-00"
              value={form.cpf_cns}
              className={inputClass}
              onAccept={(value: string) => set("cpf_cns", value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Prontuário</label>
            <Input
              value={form.prontuario}
              onChange={(e) => set("prontuario", e.target.value)}
              placeholder="Nº do prontuário"
              className={selectClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Local de atendimento</label>
            <Select
              value={form.local_atendimento_id}
              onValueChange={(v) => set("local_atendimento_id", v)}
            >
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="Selecione o local" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-700">
                {locais?.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {formatDisplayTextOrDash(l.nome)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Zona</label>
            <Select
              value={form.zona}
              onValueChange={(v) =>
                set("zona", v as "Urbana" | "Rural" | "Periurbana")
              }
            >
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-700">
                <SelectItem value="Urbana">Urbana</SelectItem>
                <SelectItem value="Rural">Rural</SelectItem>
                <SelectItem value="Periurbana">Periurbana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasOftalmo ? (
            <div className="space-y-1.5">
              <label className={labelClass}>Status operacional</label>
              <Select
                value={form.status_operacional}
                onValueChange={(v) =>
                  set("status_operacional", v as PacienteStatusOperacional)
                }
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-700">
                  {PACIENTE_STATUS_OPERACIONAIS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getPacienteStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>
      </div>

      {/* Dados gerais */}
      <div className="space-y-4">
        <SectionTitle>Dados gerais</SectionTitle>

        <div className="space-y-1.5">
          <label className={labelClass}>Medicamentos em uso</label>
          <textarea
            value={form.medicamentos_em_uso}
            onChange={(e) => set("medicamentos_em_uso", e.target.value)}
            placeholder="Liste os medicamentos e doses..."
            rows={3}
            className="w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-md px-3 py-2 text-sm resize-none outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { field: "tabagista" as const, label: "Tabagista" },
            { field: "atividade_fisica" as const, label: "Atividade física" },
          ].map(({ field: f, label: l }) => (
            <label
              key={f}
              className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <input
                type="checkbox"
                checked={form[f]}
                onChange={(e) => set(f, e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 bg-white accent-cyan-600 shrink-0"
              />
              <span className="text-slate-600 text-sm leading-tight">{l}</span>
            </label>
          ))}
        </div>
      </div>

      {isLoadingModules ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-400">
          Verificando módulos clínicos da organização...
        </div>
      ) : null}

      {hasOftalmo ? (
        <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-1">
          <SectionTitle>Oftalmologia</SectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Tempo de diagnóstico DM</label>
              <Select
                value={form.tempo_diagnostico_dm}
                onValueChange={(v) => set("tempo_diagnostico_dm", v)}
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-700">
                  <SelectItem value="<1 ano">Menos de 1 ano</SelectItem>
                  <SelectItem value="1 a 5 anos">1 a 5 anos</SelectItem>
                  <SelectItem value="5 a 10 anos">5 a 10 anos</SelectItem>
                  <SelectItem value=">10 anos">Mais de 10 anos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Tempo de diagnóstico HAS</label>
              <Select
                value={form.tempo_diagnostico_has}
                onValueChange={(v) => set("tempo_diagnostico_has", v)}
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-700">
                  <SelectItem value="<1 ano">Menos de 1 ano</SelectItem>
                  <SelectItem value="1 a 5 anos">1 a 5 anos</SelectItem>
                  <SelectItem value="5 a 10 anos">5 a 10 anos</SelectItem>
                  <SelectItem value=">10 anos">Mais de 10 anos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Acuidade visual</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={form.av_od}
                onChange={(e) => set("av_od", e.target.value)}
                placeholder="OD"
                className={selectClass}
              />
              <Input
                value={form.av_oe}
                onChange={(e) => set("av_oe", e.target.value)}
                placeholder="OE"
                className={selectClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { field: "insulina" as const, label: "Usa insulina" },
              {
                field: "fez_exame_oftalmologico" as const,
                label: "Fez exame oftalmológico",
              },
            ].map(({ field: f, label: l }) => (
              <label
                key={f}
                className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={form[f]}
                  onChange={(e) => set(f, e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 bg-white accent-cyan-600 shrink-0"
                />
                <span className="text-slate-600 text-sm leading-tight">
                  {l}
                </span>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {/* Observações */}
      <div className="space-y-4">
        <SectionTitle>Observações</SectionTitle>
        <textarea
          value={form.outras_obs}
          onChange={(e) => set("outras_obs", e.target.value)}
          placeholder="Observações adicionais sobre o paciente..."
          rows={3}
          className="w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-md px-3 py-2 text-sm resize-none outline-none"
        />
      </div>

      <p className="text-xs text-slate-400">
        {isPending
          ? "Salvando alterações..."
          : isDirty
            ? "Existem alterações não salvas."
            : "Nenhuma alteração pendente."}
      </p>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/pacientes/${paciente.id}`)}
          className="flex-1 h-11 bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isPending || !isDirty}
          className="flex-1 h-11 bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </div>
    </form>
  );
}

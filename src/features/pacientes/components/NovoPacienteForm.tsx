"use client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { queryKeys } from "@/shared/lib/query/keys";
import { getPacienteStatusLabel } from "@/shared/lib/utils/paciente-status";
import {
  PACIENTE_STATUS_OPERACIONAIS,
  type PacienteStatusOperacional,
} from "@/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";
import {
  criarPaciente,
  getLocaisAtendimento,
} from "../services/pacientes.services";

type TempoDiagnostico = "<1 ano" | "1 a 5 anos" | "5 a 10 anos" | ">10 anos";
type Zona = "Urbana" | "Rural" | "Periurbana";

type FormData = {
  nome_completo: string;
  sexo: "M" | "F" | undefined;
  cpf_cns: string;
  data_nascimento: string;
  local_atendimento_id: string | undefined;
  prontuario: string;
  medicamentos_em_uso: string;
  insulina: boolean;
  tempo_diagnostico_dm: TempoDiagnostico | undefined;
  fez_exame_oftalmologico: boolean;
  tabagista: boolean;
  atividade_fisica: boolean;
  av_od: string;
  av_oe: string;
  outras_obs: string;
  status_operacional: PacienteStatusOperacional;
  zona: Zona | undefined;
  tempo_diagnostico_has: TempoDiagnostico | undefined;
};

type Props = {
  onSuccess: () => void;
};

const initialForm: FormData = {
  nome_completo: "",
  sexo: undefined,
  cpf_cns: "",
  data_nascimento: "",
  local_atendimento_id: undefined,
  prontuario: "",
  medicamentos_em_uso: "",
  insulina: false,
  tempo_diagnostico_dm: undefined,
  fez_exame_oftalmologico: false,
  tabagista: false,
  atividade_fisica: false,
  av_od: "",
  av_oe: "",
  outras_obs: "",
  status_operacional: "cadastrado",
  zona: undefined,
  tempo_diagnostico_has: undefined,
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

const inputClass =
  "w-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-md px-3 h-10 text-sm outline-none";
const labelClass = "text-slate-600 text-xs mb-1.5 block";
const errClass = "text-red-500 text-xs mt-1";
const fieldClass =
  "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-cyan-500 h-10 w-full";

export function NovoPacienteForm({ onSuccess }: Props) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormData>(initialForm);

  const [erros, setErros] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const { data: locais } = useQuery({
    queryKey: ["locais_atendimento"],
    queryFn: getLocaisAtendimento,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: criarPaciente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pacientes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.home.metricas });
      queryClient.invalidateQueries({
        queryKey: queryKeys.home.ultimosPacientes,
      });
      toast.success("Paciente cadastrado com sucesso!");
      onSuccess();
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar paciente", { description: error.message });
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
    mutate({
      nome_completo: form.nome_completo,
      sexo: form.sexo!,
      cpf_cns: form.cpf_cns || undefined,
      data_nascimento: form.data_nascimento || undefined,
      local_atendimento_id: form.local_atendimento_id,
      prontuario: form.prontuario || undefined,
      medicamentos_em_uso: form.medicamentos_em_uso || undefined,
      insulina: form.insulina,
      tempo_diagnostico_dm: form.tempo_diagnostico_dm,
      fez_exame_oftalmologico: form.fez_exame_oftalmologico,
      tabagista: form.tabagista,
      atividade_fisica: form.atividade_fisica,
      av_od: form.av_od || undefined,
      av_oe: form.av_oe || undefined,
      outras_obs: form.outras_obs || undefined,
      status_operacional: form.status_operacional,
      zona: form.zona,
      tempo_diagnostico_has: form.tempo_diagnostico_has,
    });
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
            className={fieldClass}
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
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent
                className="bg-white border-slate-200 text-slate-700"
                position="popper"
              >
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
              className={inputClass}
              onAccept={(value: string) => {
                if (value.length === 10) {
                  const [d, m, y] = value.split("/");
                  set("data_nascimento", `${y}-${m}-${d}`);
                } else {
                  set("data_nascimento", "");
                }
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
              className={fieldClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Local de atendimento</label>
          <Select
            value={form.local_atendimento_id}
            onValueChange={(v) => set("local_atendimento_id", v)}
          >
            <SelectTrigger className={fieldClass}>
              <SelectValue placeholder="Selecione o local" />
            </SelectTrigger>
            <SelectContent
              className="bg-white border-slate-200 text-slate-700"
              position="popper"
            >
              {locais?.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {formatDisplayTextOrDash(l.nome)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Status operacional</label>
          <Select
            value={form.status_operacional}
            onValueChange={(v) =>
              set("status_operacional", v as PacienteStatusOperacional)
            }
          >
            <SelectTrigger className={fieldClass}>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent
              className="bg-white border-slate-200 text-slate-700"
              position="popper"
            >
              {PACIENTE_STATUS_OPERACIONAIS.map((status) => (
                <SelectItem key={status} value={status}>
                  {getPacienteStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dados clínicos */}
      <div className="space-y-4">
        <SectionTitle>Dados clínicos</SectionTitle>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Tempo de diagnóstico DM</label>
            <Select
              value={form.tempo_diagnostico_dm}
              onValueChange={(v) =>
                set("tempo_diagnostico_dm", v as TempoDiagnostico)
              }
            >
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent
                className="bg-white border-slate-200 text-slate-700"
                position="popper"
              >
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
              onValueChange={(v) =>
                set("tempo_diagnostico_has", v as TempoDiagnostico)
              }
            >
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent
                className="bg-white border-slate-200 text-slate-700"
                position="popper"
              >
                <SelectItem value="<1 ano">Menos de 1 ano</SelectItem>
                <SelectItem value="1 a 5 anos">1 a 5 anos</SelectItem>
                <SelectItem value="5 a 10 anos">5 a 10 anos</SelectItem>
                <SelectItem value=">10 anos">Mais de 10 anos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Zona</label>
            <Select
              value={form.zona}
              onValueChange={(v) => set("zona", v as Zona)}
            >
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent
                className="bg-white border-slate-200 text-slate-700"
                position="popper"
              >
                <SelectItem value="Urbana">Urbana</SelectItem>
                <SelectItem value="Rural">Rural</SelectItem>
                <SelectItem value="Periurbana">Periurbana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Acuidade visual</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={form.av_od}
                onChange={(e) => set("av_od", e.target.value)}
                placeholder="OD"
                className={fieldClass}
              />
              <Input
                value={form.av_oe}
                onChange={(e) => set("av_oe", e.target.value)}
                placeholder="OE"
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { field: "insulina" as const, label: "Usa insulina" },
            { field: "tabagista" as const, label: "Tabagista" },
            { field: "atividade_fisica" as const, label: "Atividade física" },
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
              <span className="text-slate-600 text-sm leading-tight">{l}</span>
            </label>
          ))}
        </div>
      </div>

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
          ? "Cadastrando paciente..."
          : isDirty
            ? "Alterações prontas para cadastrar."
            : "Preencha os dados para cadastrar um paciente."}
      </p>

      <Button
        type="submit"
        disabled={isPending || !isDirty}
        className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Cadastrando...
          </>
        ) : (
          "Cadastrar paciente"
        )}
      </Button>
    </form>
  );
}

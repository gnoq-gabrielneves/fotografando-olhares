"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryKeys } from "@/lib/query/keys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";
import { z } from "zod";
import {
  criarPaciente,
  getLocaisAtendimento,
} from "../queries/queries-pacientes";

const novoPacienteSchema = z.object({
  nome_completo: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  sexo: z.enum(["M", "F"]),
  cpf_cns: z.string().optional(),
  data_nascimento: z.string().optional(),
  local_atendimento_id: z.string().optional(),
  prontuario: z.string().optional(),
  medicamentos_em_uso: z.string().optional(),
  insulina: z.boolean().optional(),
  tempo_diagnostico_dm: z
    .enum(["<1 ano", "1 a 5 anos", "5 a 10 anos", ">10 anos"])
    .optional(),
  fez_exame_oftalmologico: z.boolean().optional(),
  tabagista: z.boolean().optional(),
  atividade_fisica: z.boolean().optional(),
  av_od: z.string().optional(),
  av_oe: z.string().optional(),
  outras_obs: z.string().optional(),
});

type NovoPacienteSchema = z.infer<typeof novoPacienteSchema>;

type Props = {
  onSuccess: () => void;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-medium text-cyan-500 uppercase tracking-wider whitespace-nowrap">
        {children}
      </span>
      <div className="h-px bg-slate-800 flex-1" />
    </div>
  );
}

const inputClass =
  "w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-md px-3 h-10 text-sm outline-none";
const labelClass = "text-slate-400 text-xs mb-1.5 block";
const errClass = "text-red-400 text-xs mt-1";

type MaskedFieldProps = {
  mask: string;
  placeholder: string;
  onAccept: (value: string) => void;
};

function MaskedField({ mask, placeholder, onAccept }: MaskedFieldProps) {
  return (
    <IMaskInput
      mask={mask}
      placeholder={placeholder}
      className={inputClass}
      onAccept={onAccept}
    />
  );
}

export function NovoPacienteForm({ onSuccess }: Props) {
  const queryClient = useQueryClient();

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NovoPacienteSchema>({
    resolver: zodResolver(novoPacienteSchema),
  });

  function onSubmit(values: NovoPacienteSchema) {
    mutate(values);
  }

  const selectClass =
    "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500 h-10";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-8">
      {/* Dados pessoais */}
      <div className="space-y-4">
        <SectionTitle>Dados pessoais</SectionTitle>

        <div className="space-y-1.5">
          <label className={labelClass}>Nome completo *</label>
          <Input
            {...register("nome_completo")}
            placeholder="Nome completo do paciente"
            className={selectClass}
          />
          {errors.nome_completo && (
            <p className={errClass}>{errors.nome_completo.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Sexo *</label>
            <Select onValueChange={(v) => setValue("sexo", v as "M" | "F")}>
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
              </SelectContent>
            </Select>
            {errors.sexo && <p className={errClass}>{errors.sexo.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Data de nascimento</label>
            <MaskedField
              mask="00/00/0000"
              placeholder="DD/MM/AAAA"
              onAccept={(value) => {
                if (value.length === 10) {
                  const [d, m, y] = value.split("/");
                  setValue("data_nascimento", `${y}-${m}-${d}`);
                } else {
                  setValue("data_nascimento", "");
                }
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClass}>CPF / CNS</label>
            <MaskedField
              mask="000.000.000-00"
              placeholder="000.000.000-00"
              onAccept={(value) => setValue("cpf_cns", value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Prontuário</label>
            <Input
              {...register("prontuario")}
              placeholder="Nº do prontuário"
              className={selectClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Local de atendimento</label>
          <Select onValueChange={(v) => setValue("local_atendimento_id", v)}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Selecione o local" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
              {locais?.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.nome}
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
            {...register("medicamentos_em_uso")}
            placeholder="Liste os medicamentos e doses..."
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-md px-3 py-2 text-sm resize-none outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Tempo de diagnóstico DM</label>
            <Select
              onValueChange={(v) =>
                setValue(
                  "tempo_diagnostico_dm",
                  v as NovoPacienteSchema["tempo_diagnostico_dm"],
                )
              }
            >
              <SelectTrigger className={selectClass}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
                <SelectItem value="<1 ano">Menos de 1 ano</SelectItem>
                <SelectItem value="1 a 5 anos">1 a 5 anos</SelectItem>
                <SelectItem value="5 a 10 anos">5 a 10 anos</SelectItem>
                <SelectItem value=">10 anos">Mais de 10 anos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Acuidade visual</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                {...register("av_od")}
                placeholder="OD"
                className={selectClass}
              />
              <Input
                {...register("av_oe")}
                placeholder="OE"
                className={selectClass}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { field: "insulina", label: "Usa insulina" },
            { field: "tabagista", label: "Tabagista" },
            { field: "atividade_fisica", label: "Atividade física" },
            {
              field: "fez_exame_oftalmologico",
              label: "Fez exame oftalmológico",
            },
          ].map(({ field: f, label: l }) => (
            <label
              key={f}
              className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <input
                type="checkbox"
                {...register(f as keyof NovoPacienteSchema)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 accent-cyan-500 shrink-0"
              />
              <span className="text-slate-300 text-sm leading-tight">{l}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Observações */}
      <div className="space-y-4">
        <SectionTitle>Observações</SectionTitle>
        <textarea
          {...register("outras_obs")}
          placeholder="Observações adicionais sobre o paciente..."
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-md px-3 py-2 text-sm resize-none outline-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
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

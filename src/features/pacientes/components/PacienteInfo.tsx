import { PacienteDetalhado } from "@/types";

type Props = {
  paciente: PacienteDetalhado;
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm shrink-0">{label}</span>
      <span className="text-slate-800 text-sm text-right">{value || "—"}</span>
    </div>
  );
}

function BoolRow({
  label,
  value,
}: {
  label: string;
  value: boolean | null | undefined;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm shrink-0">{label}</span>
      {value === null || value === undefined ? (
        <span className="text-slate-800 text-sm">—</span>
      ) : (
        <span
          className={`text-xs px-2 py-0.5 rounded-md font-medium border ${
            value
              ? "bg-cyan-50 text-cyan-700 border-cyan-200"
              : "bg-slate-100 text-slate-500 border-slate-200"
          }`}
        >
          {value ? "Sim" : "Não"}
        </span>
      )}
    </div>
  );
}

function formatarData(data: string | null) {
  if (!data) return null;
  return new Date(data).toLocaleDateString("pt-BR");
}

export function PacienteInfo({ paciente }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Dados pessoais */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xs font-medium text-cyan-600 uppercase tracking-wider mb-2">
          Dados pessoais
        </h2>
        <InfoRow label="CPF / CNS" value={paciente.cpf_cns} />
        <InfoRow label="Prontuário" value={paciente.prontuario} />
        <InfoRow
          label="Data de nascimento"
          value={formatarData(paciente.data_nascimento)}
        />
        <InfoRow
          label="Local de atendimento"
          value={paciente.locais_atendimento?.nome}
        />
        <InfoRow label="Extensionista" value={paciente.profiles?.full_name} />
        <InfoRow
          label="Cadastrado em"
          value={formatarData(paciente.created_at)}
        />
      </div>

      {/* Dados clínicos */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xs font-medium text-cyan-600 uppercase tracking-wider mb-2">
          Dados clínicos
        </h2>
        <InfoRow
          label="Tempo de diagnóstico DM"
          value={paciente.tempo_diagnostico_dm}
        />
        <InfoRow
          label="Tempo de diagnóstico HAS"
          value={paciente.tempo_diagnostico_has}
        />
        <InfoRow label="Zona" value={paciente.zona} />
        <InfoRow label="Acuidade visual OD" value={paciente.av_od} />
        <InfoRow label="Acuidade visual OE" value={paciente.av_oe} />
        <BoolRow label="Usa insulina" value={paciente.insulina} />
        <BoolRow label="Tabagista" value={paciente.tabagista} />
        <BoolRow label="Atividade física" value={paciente.atividade_fisica} />
        <BoolRow
          label="Fez exame oftalmológico"
          value={paciente.fez_exame_oftalmologico}
        />
        <InfoRow
          label="Último exame oftalmológico"
          value={paciente.qt_tempo_ultimo_exame}
        />
      </div>

      {/* Medicamentos */}
      {paciente.medicamentos_em_uso && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xs font-medium text-cyan-600 uppercase tracking-wider mb-3">
            Medicamentos em uso
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {paciente.medicamentos_em_uso}
          </p>
        </div>
      )}

      {/* Observações */}
      {paciente.outras_obs && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xs font-medium text-cyan-600 uppercase tracking-wider mb-3">
            Observações
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {paciente.outras_obs}
          </p>
        </div>
      )}
    </div>
  );
}

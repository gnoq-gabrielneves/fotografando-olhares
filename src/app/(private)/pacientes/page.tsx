import { ExportarButton } from "@/components/ExportarButton/ExportarButton";
import { NovoPacienteSheet } from "@/features/pacientes/components/NovoPacienteSheet";
import { PacientesTabela } from "@/features/pacientes/components/PacientesTabela";

export default function PacientesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Pacientes</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie os pacientes cadastrados no projeto
          </p>
        </div>
        <div className="flex flex-row gap-2 shrink-0">
          <ExportarButton />
          <NovoPacienteSheet />
        </div>
      </div>
      <PacientesTabela />
    </div>
  );
}

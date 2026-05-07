import { ExportarButton } from "@/components/ExportarButton/ExportarButton";
import { NovoPacienteSheet } from "@/features/pacientes/components/NovoPacienteSheet";
import { PacientesTabela } from "@/features/pacientes/components/PacientesTabela";

export default function PacientesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Pacientes</h1>
          <p className="text-slate-400 text-sm mt-1">
            Gerencie os pacientes cadastrados no projeto
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <ExportarButton />
          <NovoPacienteSheet />
        </div>
      </div>
      <PacientesTabela />
    </div>
  );
}

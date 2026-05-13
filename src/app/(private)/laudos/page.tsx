import { ExportarButton } from "@/components/ExportarButton/ExportarButton";
import { LaudosTabela } from "@/features/laudos/components/LaudosTabela";

export default function LaudosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Laudos</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie os laudos oftalmológicos emitidos
          </p>
        </div>
        <ExportarButton />
      </div>
      <LaudosTabela />
    </div>
  );
}

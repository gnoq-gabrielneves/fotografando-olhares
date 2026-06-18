import { ExportarButton } from "@/components/ExportarButton/ExportarButton";
import { LaudosTabela } from "@/features/laudos/components/LaudosTabela";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laudos | Fotografando Olhares",
  description: "Laudos oftalmológicos emitidos no projeto de rastreamento de retinopatia diabética.",
};

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

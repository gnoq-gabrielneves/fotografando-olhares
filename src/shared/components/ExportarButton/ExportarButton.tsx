"use client";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { getTodosLaudos } from "@/features/laudos/services/getLaudos";
import { getTodosPacientes } from "@/features/pacientes/services/pacientes.services";
import {
  exportarLaudos,
  exportarPacientes,
} from "@/shared/lib/excel-export/excel-export";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

export function ExportarButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleExportar(tipo: "pacientes" | "laudos") {
    setIsLoading(true);
    try {
      if (tipo === "pacientes") {
        const data = await getTodosPacientes();
        await exportarPacientes(data);
      } else {
        const data = await getTodosLaudos();
        await exportarLaudos(data);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isLoading}
          className="gap-2 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white border-slate-200 text-slate-700"
      >
        <DropdownMenuItem
          onClick={() => handleExportar("pacientes")}
          className="gap-2 cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
        >
          <Download className="w-4 h-4 text-slate-400" />
          Exportar pacientes
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExportar("laudos")}
          className="gap-2 cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
        >
          <Download className="w-4 h-4 text-slate-400" />
          Exportar laudos
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

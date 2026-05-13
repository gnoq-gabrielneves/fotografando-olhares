"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

const pageInfo: Record<string, { title: string; description: string }> = {
  "/home": {
    title: "Início",
    description: "Visão geral do projeto de triagem",
  },
  "/pacientes": {
    title: "Pacientes",
    description: "Gerencie os pacientes cadastrados no projeto",
  },
  "/laudos": {
    title: "Laudos",
    description: "Gerencie os laudos oftalmológicos emitidos",
  },
  "/relatorios": {
    title: "Relatórios",
    description: "Análises e estatísticas do projeto",
  },
  "/usuarios": {
    title: "Usuários",
    description: "Gerencie os usuários do sistema",
  },
};

export function AppHeader() {
  const pathname = usePathname();
  const baseRoute = "/" + pathname.split("/")[1];
  const info = pageInfo[baseRoute] ?? { title: "", description: "" };

  return (
    <header className="flex items-center gap-3 h-20 px-4 border-b border-slate-200 bg-white shrink-0 sticky top-0 z-10">
      <SidebarTrigger className="text-slate-400 hover:text-slate-600 hover:bg-slate-100" />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-800 leading-tight">
          {info.title}
        </span>
        <span className="text-xs text-slate-500 leading-tight">
          {info.description}
        </span>
      </div>
    </header>
  );
}

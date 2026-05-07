"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useProfile } from "@/hooks/use-profile";
import { BarChart2, Eye, FileText, Home, UserCog, Users } from "lucide-react";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";

export function AppSidebar() {
  const { profile } = useProfile();

  const navItems = [
    { title: "Início", href: "/home", icon: Home },
    { title: "Pacientes", href: "/pacientes", icon: Users },
    { title: "Laudos", href: "/laudos", icon: FileText },
    { title: "Relatórios", href: "/relatorios", icon: BarChart2 },
    ...(profile?.role === "admin"
      ? [{ title: "Usuários", href: "/usuarios", icon: UserCog }]
      : []),
  ];

  return (
    <Sidebar className="border-r border-slate-800 bg-slate-900">
      <SidebarHeader className="border-b border-slate-800 px-4 flex justify-center items-start h-20">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800/50 shrink-0">
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-white">
              Fotografando Olhares
            </span>
            <span className="text-xs text-slate-500 line-clamp-1">LAOF</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-slate-600 uppercase tracking-wider px-2 mb-1">
            Menu
          </SidebarGroupLabel>
          <NavMain items={navItems} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-800 px-2 py-3">
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

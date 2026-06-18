/* eslint-disable @next/next/no-img-element */
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
import { Activity, BarChart2, FileText, Home, UserCog, Users } from "lucide-react";
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
      ? [
          { title: "Usuários", href: "/usuarios", icon: UserCog },
          { title: "Atividade", href: "/atividade", icon: Activity },
        ]
      : []),
  ];

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarHeader className="border-b border-slate-200 h-20 flex items-center justify-center">
        <img
          src="/fotografandoolhares.png"
          alt="Fotografando Olhares"
          className="h-25 w-auto object-contain"
        />
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-slate-400 uppercase tracking-wider px-2 mb-1">
            Menu
          </SidebarGroupLabel>
          <NavMain items={navItems} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 px-2 py-3">
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

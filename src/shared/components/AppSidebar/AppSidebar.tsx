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
} from "@/shared/components/ui/sidebar";
import { useProfile } from "@/shared/hooks/use-profile";
import {
  Activity,
  BarChart2,
  BookOpen,
  FileText,
  Home,
  UserCog,
  Users,
} from "lucide-react";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { OrganizationSwitcher } from "./OrganizationSwitcher";

export function AppSidebar() {
  const { profile } = useProfile();
  const canManage = profile?.role === "admin" || profile?.role === "developer";

  const navGroups = [
    {
      label: "Visão geral",
      items: [{ title: "Início", href: "/home", icon: Home }],
    },
    {
      label: "Operação clínica",
      items: [
        { title: "Pacientes", href: "/pacientes", icon: Users },
        { title: "Laudos", href: "/laudos", icon: FileText },
      ],
    },
    {
      label: "Gestão",
      items: [{ title: "Relatórios", href: "/relatorios", icon: BarChart2 }],
    },
    {
      label: "Aprendizado",
      items: [{ title: "Treinamento", href: "/treinamento", icon: BookOpen }],
    },
    ...(canManage
      ? [
          {
            label: "Administração",
            items: [
              { title: "Usuários", href: "/usuarios", icon: UserCog },
              { title: "Atividade", href: "/atividade", icon: Activity },
            ],
          },
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
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel className="text-[0.68rem] text-slate-400 uppercase tracking-wider px-2 mb-1">
              {group.label}
            </SidebarGroupLabel>
            <NavMain items={group.items} />
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 px-2 py-3">
        <OrganizationSwitcher />
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

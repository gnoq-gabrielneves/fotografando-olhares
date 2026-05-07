"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProfile } from "@/hooks/use-profile";
import { signOut } from "@/services/auth";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { profile, isLoading } = useProfile();

  if (isLoading || !profile)
    return (
      <div className="flex items-center gap-2 px-2 py-3 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-24 bg-slate-800 rounded" />
          <div className="h-2.5 w-16 bg-slate-800 rounded" />
        </div>
      </div>
    );

  const initials = profile.full_name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const roleLabel = {
    admin: "Administrador",
    extensionista: "Extensionista",
    laudador: "Laudador",
  }[profile.role];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="text-slate-300 hover:bg-slate-800 hover:text-white data-[state=open]:bg-slate-800"
            >
              <Avatar className="w-8 h-8 border border-slate-700">
                <AvatarImage src={profile.avatar_url ?? undefined} />
                <AvatarFallback className="bg-cyan-950 text-cyan-400 text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-sm font-medium text-white truncate">
                  {profile.full_name}
                </span>
                <span className="text-xs text-cyan-500 truncate">
                  {roleLabel}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto w-4 h-4 text-slate-500" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            className="w-56 bg-slate-900 border-slate-800 text-slate-200"
          >
            <DropdownMenuLabel className="flex items-center gap-2 p-2">
              <Avatar className="w-8 h-8 border border-slate-700">
                <AvatarImage src={profile.avatar_url ?? undefined} />
                <AvatarFallback className="bg-cyan-950 text-cyan-400 text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-medium text-white truncate">
                  {profile.full_name}
                </span>
                <span className="text-xs text-cyan-500 truncate">
                  {roleLabel}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-slate-800" />

            <DropdownMenuItem className="gap-2 cursor-pointer hover:bg-slate-800 focus:bg-slate-800">
              <BadgeCheck className="w-4 h-4 text-slate-400" />
              Meu perfil
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-800" />

            <DropdownMenuItem
              onClick={() => signOut()}
              className="gap-2 cursor-pointer text-red-400 hover:bg-red-950/50 hover:text-red-400 focus:bg-red-950/50 focus:text-red-400"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

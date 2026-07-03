"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { clinicalModules, type ClinicalModuleId } from "@/shared/lib/modules/clinical-modules";
import { cn } from "@/shared/lib/utils";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  moduleId?: ClinicalModuleId;
};

type NavMainProps = {
  items: NavItem[];
  enabledModuleIds?: Set<string>;
  showModuleAvailability?: boolean;
};

export function NavMain({
  items,
  enabledModuleIds = new Set(),
  showModuleAvailability = false,
}: NavMainProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <SidebarMenu>
      {items.map((item) => {
        const isActive = pathname === item.href;
        const requiredModule = item.moduleId
          ? clinicalModules[item.moduleId]
          : null;
        const isUnavailable =
          showModuleAvailability &&
          !!item.moduleId &&
          !enabledModuleIds.has(item.moduleId);

        const button = (
          <SidebarMenuButton
            asChild
            isActive={isActive}
            className={cn(
              isActive
                ? "bg-cyan-50 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-600"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
              isUnavailable &&
                "text-slate-300 opacity-70 hover:bg-slate-50 hover:text-slate-400",
            )}
          >
            <Link href={item.href} aria-disabled={isUnavailable}>
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
              {isUnavailable ? (
                <LockKeyhole className="ml-auto h-3.5 w-3.5 text-amber-500" />
              ) : null}
            </Link>
          </SidebarMenuButton>
        );

        return (
          <SidebarMenuItem key={item.href}>
            {isUnavailable ? (
              <Tooltip>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  Módulo {requiredModule?.name ?? item.moduleId} não habilitado
                  nesta organização
                </TooltipContent>
              </Tooltip>
            ) : (
              button
            )}
          </SidebarMenuItem>
        );
      })}
      </SidebarMenu>
    </TooltipProvider>
  );
}

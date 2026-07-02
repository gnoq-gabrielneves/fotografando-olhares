"use client";

import {
  SidebarTrigger,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";

export function FloatingSidebarTrigger() {
  const { isMobile, state } = useSidebar();
  const isVisible = isMobile || state === "collapsed";

  return (
    <SidebarTrigger
      aria-label="Alternar menu lateral"
      className={cn(
        "fixed left-4 top-4 z-30 h-10 w-10 rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800",
        !isVisible && "hidden",
      )}
    />
  );
}

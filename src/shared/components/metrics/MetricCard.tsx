import type { ElementType, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type MetricCardTone = "cyan" | "violet" | "amber" | "red";

const toneStyles: Record<
  MetricCardTone,
  {
    icon: string;
    iconBox: string;
    accent: string;
    pulse: string;
  }
> = {
  cyan: {
    icon: "text-cyan-600",
    iconBox: "border-cyan-100 bg-cyan-50",
    accent: "border-l-cyan-400",
    pulse: "bg-cyan-600",
  },
  violet: {
    icon: "text-violet-600",
    iconBox: "border-violet-100 bg-violet-50",
    accent: "border-l-violet-400",
    pulse: "bg-violet-600",
  },
  amber: {
    icon: "text-amber-600",
    iconBox: "border-amber-100 bg-amber-50",
    accent: "border-l-amber-400",
    pulse: "bg-amber-600",
  },
  red: {
    icon: "text-red-600",
    iconBox: "border-red-100 bg-red-50",
    accent: "border-l-red-400",
    pulse: "bg-red-600",
  },
};

type MetricCardProps = {
  label: string;
  value: ReactNode;
  icon: ElementType;
  tone: MetricCardTone;
  sublabel?: ReactNode;
  loading?: boolean;
  urgent?: boolean;
  onClick?: () => void;
  compact?: boolean;
  accent?: boolean;
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone,
  sublabel,
  loading = false,
  urgent = false,
  onClick,
  compact = false,
  accent = false,
}: MetricCardProps) {
  const styles = toneStyles[tone];
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "rounded-xl border border-slate-200 bg-white text-left shadow-sm transition-all",
        compact ? "p-4" : "p-5",
        accent && "border-l-4",
        accent && styles.accent,
        onClick && "hover:border-slate-300 hover:shadow-md",
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className={cn("rounded-lg border p-1.5", styles.iconBox)}>
          <Icon className={cn("h-3.5 w-3.5", styles.icon)} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-8 w-16 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <p className="text-3xl font-bold leading-none text-slate-800">
              {value}
            </p>
            {urgent ? (
              <span className={cn("mt-1 h-2 w-2 rounded-full animate-pulse", styles.pulse)} />
            ) : null}
          </div>
          {sublabel ? (
            <p className="mt-1.5 text-xs text-slate-400">{sublabel}</p>
          ) : null}
        </>
      )}
    </Component>
  );
}

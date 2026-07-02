import type { ElementType, ReactNode } from "react";
import { AlertCircle, Inbox } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type EmptyStateTone = "neutral" | "danger";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ElementType;
  action?: ReactNode;
  tone?: EmptyStateTone;
  className?: string;
};

const toneStyles: Record<EmptyStateTone, string> = {
  neutral: "border-slate-200 bg-white text-slate-400",
  danger: "border-red-200 bg-red-50 text-red-500",
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  tone = "neutral",
  className,
}: EmptyStateProps) {
  const Icon = icon ?? (tone === "danger" ? AlertCircle : Inbox);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border p-10 text-center shadow-sm",
        toneStyles[tone],
        className,
      )}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-current/15 bg-white/70">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {description ? (
        <p className="mt-1 max-w-md text-sm text-slate-400">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function QueryErrorState({ message }: { message?: string }) {
  return (
    <EmptyState
      tone="danger"
      title="Não foi possível carregar os dados"
      description={message ?? "Tente recarregar a página em alguns instantes."}
    />
  );
}

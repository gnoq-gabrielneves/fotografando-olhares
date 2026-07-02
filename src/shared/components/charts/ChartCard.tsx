import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <div
      className={[
        "bg-white border border-slate-200 rounded-xl p-6 shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h2 className="text-slate-700 font-medium text-sm mb-6">{title}</h2>
      {children}
    </div>
  );
}

export function ChartLoading() {
  return (
    <div className="h-64 flex items-center justify-center">
      <div className="w-32 h-32 rounded-full border-4 border-slate-100 border-t-cyan-500 animate-spin" />
    </div>
  );
}

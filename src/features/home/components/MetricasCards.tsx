"use client";

import { MetricCard } from "@/shared/components/metrics/MetricCard";
import { queryKeys } from "@/shared/lib/query/keys";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Clock, FileText, Users } from "lucide-react";
import type { ElementType } from "react";
import { useRouter } from "next/navigation";
import { getMetricas } from "../queries/queries-home";
import { SkeletonCards } from "./SkeletonCards";

const cards = [
  {
    key: "totalPacientes",
    label: "Pacientes cadastrados",
    icon: Users,
    tone: "cyan",
    href: "/pacientes",
  },
  {
    key: "totalLaudos",
    label: "Laudos emitidos",
    icon: FileText,
    tone: "violet",
    href: "/laudos",
  },
  {
    key: "totalSemLaudo",
    label: "Pendentes de laudo",
    icon: Clock,
    tone: "amber",
    href: "/pacientes",
    urgent: true,
  },
  {
    key: "totalComRD",
    label: "Casos com RD",
    icon: AlertTriangle,
    tone: "red",
    href: "/pacientes",
    urgent: true,
  },
] satisfies {
  key: "totalPacientes" | "totalLaudos" | "totalSemLaudo" | "totalComRD";
  label: string;
  icon: ElementType;
  tone: "cyan" | "violet" | "amber" | "red";
  href: string;
  urgent?: boolean;
}[];

export function MetricasCards() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.home.metricas,
    queryFn: getMetricas,
  });

  if (isLoading) return <SkeletonCards />;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => (
        <MetricCard
          key={card.key}
          onClick={() => router.push(card.href)}
          label={card.label}
          value={data?.[card.key] ?? 0}
          icon={card.icon}
          tone={card.tone}
          compact
          urgent={card.urgent && (data?.[card.key] ?? 0) > 0}
        />
      ))}
    </div>
  );
}

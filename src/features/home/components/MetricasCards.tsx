"use client";

import { MetricCard } from "@/shared/components/metrics/MetricCard";
import { useEnabledClinicalModule } from "@/shared/hooks/use-enabled-clinical-module";
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
    moduleId: "oftalmo",
  },
  {
    key: "totalSemLaudo",
    label: "Pendentes de laudo",
    icon: Clock,
    tone: "amber",
    href: "/pacientes",
    urgent: true,
    moduleId: "oftalmo",
  },
  {
    key: "totalComRD",
    label: "Casos com RD",
    icon: AlertTriangle,
    tone: "red",
    href: "/pacientes",
    urgent: true,
    moduleId: "oftalmo",
  },
] satisfies {
  key: "totalPacientes" | "totalLaudos" | "totalSemLaudo" | "totalComRD";
  label: string;
  icon: ElementType;
  tone: "cyan" | "violet" | "amber" | "red";
  href: string;
  urgent?: boolean;
  moduleId?: "oftalmo";
}[];

export function MetricasCards() {
  const router = useRouter();
  const { isEnabled: hasOftalmo, isLoading: isLoadingModules } =
    useEnabledClinicalModule("oftalmo");
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.home.metricas,
    queryFn: getMetricas,
  });

  if (isLoading || isLoadingModules) return <SkeletonCards />;

  const visibleCards = cards.filter((card) => !card.moduleId || hasOftalmo);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {visibleCards.map((card) => (
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

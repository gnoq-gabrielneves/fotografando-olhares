import type { Metadata } from "next";
import { AtividadeFeed } from "@/features/atividade/components/AtividadeFeed";
import { GraficoRD } from "@/features/home/components/GraficoRd";
import { HomeGreeting } from "@/features/home/components/HomeGreeting";
import { MetricasCards } from "@/features/home/components/MetricasCards";
import { UltimosPacientes } from "@/features/home/components/UltimosPacientes";

export const metadata: Metadata = {
  title: "Início | Fotografando Olhares",
  description: "Visão geral do projeto: métricas, últimos cadastros e atividade recente.",
};

export default function HomePage() {
  return (
    <div className="space-y-6">
      <HomeGreeting />
      <MetricasCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1">
          <UltimosPacientes />
        </div>
        <div className="lg:col-span-1">
          <AtividadeFeed />
        </div>
        <div className="lg:col-span-1">
          <GraficoRD />
        </div>
      </div>
    </div>
  );
}

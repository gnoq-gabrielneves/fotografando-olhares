import { GraficoRD } from "@/features/home/components/GraficoRd";
import { HomeGreeting } from "@/features/home/components/HomeGreeting";
import { MetricasCards } from "@/features/home/components/MetricasCards";
import { UltimosPacientes } from "@/features/home/components/UltimosPacientes";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <HomeGreeting />
      <MetricasCards />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        <div className="lg:col-span-3">
          <UltimosPacientes />
        </div>
        <div className="lg:col-span-2">
          <GraficoRD />
        </div>
      </div>
    </div>
  );
}

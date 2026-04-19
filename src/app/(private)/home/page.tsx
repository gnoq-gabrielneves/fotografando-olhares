import { GraficoLocais } from "@/features/home/components/GraficoLocais";
import { GraficoRD } from "@/features/home/components/GraficoRd";
import { MetricasCards } from "@/features/home/components/MetricasCards";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <MetricasCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraficoRD />
        <GraficoLocais />
      </div>
    </div>
  );
}

import { AtividadePage } from "@/features/atividade/components/AtividadePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atividade | Fotografando Olhares",
  description: "Histórico de ações realizadas no sistema pelos usuários.",
};

export default function AtividadePageRoute() {
  return <AtividadePage />;
}

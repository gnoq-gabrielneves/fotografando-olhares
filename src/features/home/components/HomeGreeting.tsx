"use client";

import { useProfile } from "@/shared/hooks/use-profile";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { formatDisplayText, formatSentenceStart } from "@/shared/lib/format/text";
import { FileText, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { NovoPacienteSheet } from "@/features/pacientes/components/NovoPacienteSheet";

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const hoje = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function HomeGreeting() {
  const { profile } = useProfile();
  const router = useRouter();

  const primeiroNome = formatDisplayText(profile?.full_name).split(" ")[0] ?? "";

  return (
    <PageHeader
      icon={Home}
      title={`${saudacao()}${primeiroNome ? `, ${primeiroNome}` : ""}`}
      description={formatSentenceStart(hoje)}
      actions={
        <>
          <button
            onClick={() => router.push("/laudos")}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            <FileText className="h-4 w-4" />
            Laudos
          </button>
          <NovoPacienteSheet />
        </>
      }
    />
  );
}

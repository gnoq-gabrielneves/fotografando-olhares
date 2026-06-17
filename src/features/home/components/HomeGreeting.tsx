"use client";

import { useProfile } from "@/hooks/use-profile";
import { FileText, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const primeiroNome = profile?.full_name?.split(" ")[0] ?? "";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          {saudacao()}{primeiroNome ? `, ${primeiroNome}` : ""} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-0.5 capitalize">{hoje}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/laudos")}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
        >
          <FileText className="w-4 h-4" />
          Laudos
        </button>
        <NovoPacienteSheet />
      </div>
    </div>
  );
}

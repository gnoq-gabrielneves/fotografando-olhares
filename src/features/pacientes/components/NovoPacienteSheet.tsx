"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { UserPlus } from "lucide-react";

export function NovoPacienteSheet() {
  return (
    <Button asChild className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2 shadow-sm">
      <Link href="/pacientes/novo">
        <UserPlus className="w-4 h-4" />
        Novo paciente
      </Link>
    </Button>
  );
}

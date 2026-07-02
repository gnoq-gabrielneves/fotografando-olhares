"use client";
import { PacienteHeader } from "@/features/pacientes/components/PacienteHeader";
import { PacienteInfo } from "@/features/pacientes/components/PacienteInfo";
import { PacienteLaudos } from "@/features/pacientes/components/PacienteLaudos";
import { PacienteSkeleton } from "@/features/pacientes/components/PacienteSkeleton";
import { getPacienteById } from "@/features/pacientes/services/pacientes.services";
import { queryKeys } from "@/shared/lib/query/keys";
import { LaudoComLaudador, PacienteDetalhado } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function PacientePage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.pacientes.byId(id),
    queryFn: () => getPacienteById(id),
  });

  if (isLoading) return <PacienteSkeleton />;

  if (!data)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Paciente não encontrado.</p>
      </div>
    );

  const paciente = data as unknown as PacienteDetalhado;

  return (
    <div className="space-y-6">
      <PacienteHeader paciente={paciente} />
      <PacienteInfo paciente={paciente} />
      <PacienteLaudos
        laudos={paciente.laudos as LaudoComLaudador[]}
        pacienteId={paciente.id}
      />
    </div>
  );
}

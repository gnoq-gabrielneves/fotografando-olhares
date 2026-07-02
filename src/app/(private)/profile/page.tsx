import type { Metadata } from "next";
import { PerfilAvatar } from "@/features/profile/components/perfil-avatar";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { UserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Meu Perfil | Fotografando Olhares",
  description: "Edite suas informações pessoais, foto e senha de acesso.",
};
import { PerfilDados } from "@/features/profile/components/perfil-dados";
import { PerfilSenha } from "@/features/profile/components/perfil-senha";

export default function PerfilPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        icon={UserRound}
        title="Meu perfil"
        description="Gerencie suas informações pessoais e segurança"
      />

      <PerfilAvatar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PerfilDados />
        <PerfilSenha />
      </div>
    </div>
  );
}

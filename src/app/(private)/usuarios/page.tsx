import type { Metadata } from "next";
import { NovoUsuarioSheet } from "@/features/usuarios/components/NovoUsuarioSheet";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { UserCog } from "lucide-react";

export const metadata: Metadata = {
  title: "Usuários | Fotografando Olhares",
  description: "Gerenciamento de usuários, permissões e organizações.",
};
import { UsuariosLista } from "@/features/usuarios/components/UsuariosLista";

export default function UsuariosPage() {
  return (
    <div className="space-y-6 w-full">
      <PageHeader
        icon={UserCog}
        title="Usuários"
        description="Gerencie os usuários do sistema"
        actions={<NovoUsuarioSheet />}
      />
      <UsuariosLista />
    </div>
  );
}

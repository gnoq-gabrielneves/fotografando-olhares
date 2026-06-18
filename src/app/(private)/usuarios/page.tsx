import type { Metadata } from "next";
import { NovoUsuarioSheet } from "@/features/usuarios/components/NovoUsuarioSheet";

export const metadata: Metadata = {
  title: "Usuários | Fotografando Olhares",
  description: "Gerenciamento de usuários do sistema: admins, extensionistas e laudadores.",
};
import { UsuariosLista } from "@/features/usuarios/components/UsuariosLista";

export default function UsuariosPage() {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Usuários</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie os usuários do sistema
          </p>
        </div>
        <NovoUsuarioSheet />
      </div>
      <UsuariosLista />
    </div>
  );
}

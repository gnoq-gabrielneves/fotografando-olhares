import { NovoUsuarioSheet } from "@/features/usuarios/components/NovoUsuarioSheet";
import { UsuariosLista } from "@/features/usuarios/components/UsuariosLista";

export default function UsuariosPage() {
  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Usuários</h1>
          <p className="text-slate-400 text-sm mt-1">
            Gerencie os usuários do sistema
          </p>
        </div>
        <NovoUsuarioSheet />
      </div>
      <UsuariosLista />
    </div>
  );
}

import { PerfilAvatar } from "@/features/profile/components/perfil-avatar";
import { PerfilDados } from "@/features/profile/components/perfil-dados";
import { PerfilSenha } from "@/features/profile/components/perfil-senha";

export default function PerfilPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Meu perfil</h1>
        <p className="text-slate-500 text-sm mt-1">
          Gerencie suas informações pessoais e segurança
        </p>
      </div>

      <PerfilAvatar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PerfilDados />
        <PerfilSenha />
      </div>
    </div>
  );
}

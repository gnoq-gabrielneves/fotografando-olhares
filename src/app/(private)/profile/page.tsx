import { PerfilAvatar } from "@/features/profile/components/perfil-avatar";
import { PerfilDados } from "@/features/profile/components/perfil-dados";
import { PerfilSenha } from "@/features/profile/components/perfil-senha";

export default function PerfilPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Meu perfil</h1>
        <p className="text-slate-500 text-sm mt-1">
          Gerencie suas informações pessoais
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex items-center justify-center">
        <PerfilAvatar />
      </div>

      <PerfilDados />
      <PerfilSenha />
    </div>
  );
}

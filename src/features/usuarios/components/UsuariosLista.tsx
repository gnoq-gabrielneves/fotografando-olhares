"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { EmptyState, QueryErrorState } from "@/shared/components/states/EmptyState";
import { ListSkeletonRows } from "@/shared/components/states/TableSkeletonRows";
import { useProfile } from "@/shared/hooks/use-profile";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import { Profile } from "@/shared/types";
import { Trash2 } from "lucide-react";
import { useExcluirUsuario, useUsuarios } from "../hooks/use-users";
import { EditarUsuarioSheet } from "./EditarUsuarioSheet";

const roleLabel: Record<string, string> = {
  developer: "Desenvolvedor",
  admin: "Administrador",
  extensionista: "Extensionista",
  laudador: "Laudador",
};

const roleBadge: Record<string, string> = {
  developer: "bg-slate-900 text-white border-slate-800",
  admin: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  extensionista: "bg-blue-50 text-blue-700 border-blue-200",
  laudador: "bg-lime-50 text-lime-700 border-lime-200",
};

const roleOrder = ["developer", "admin", "extensionista", "laudador"];

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function UsuarioCard({ usuario, isCurrentUser }: { usuario: Profile; isCurrentUser: boolean }) {
  const { mutate: deletar } = useExcluirUsuario();

  const initials = usuario.full_name
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-colors">
      <Avatar className="w-11 h-11 border border-slate-200 shrink-0">
        <AvatarImage src={usuario.avatar_url || undefined} />
        <AvatarFallback className="bg-cyan-50 text-cyan-600 text-sm font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-slate-800 truncate">
            {formatDisplayTextOrDash(usuario.full_name)}
          </span>
          {isCurrentUser && (
            <span className="text-xs text-slate-400 font-normal">(você)</span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Membro desde {formatarData(usuario.created_at)}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-md border ${roleBadge[usuario.role] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
          {roleLabel[usuario.role] ?? usuario.role}
        </span>

        <EditarUsuarioSheet usuario={usuario} />

        {!isCurrentUser && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white border-slate-200 !max-w-xs w-[calc(100%-2rem)] p-6 rounded-xl">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-200 mx-auto mb-4">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <AlertDialogHeader className="text-center space-y-1">
                <AlertDialogTitle className="text-slate-800 text-base">
                  Excluir usuário?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500 text-sm">
                  A conta de{" "}
                  <span className="text-slate-800 font-medium">
                    {formatDisplayTextOrDash(usuario.full_name)}
                  </span>{" "}
                  será excluída permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4 flex gap-2 sm:flex-row">
                <AlertDialogCancel className="flex-1 bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deletar(usuario.id)}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white border-0"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}

function RoleSection({ role, usuarios, currentUserId }: { role: string; usuarios: Profile[]; currentUserId?: string }) {
  if (usuarios.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {roleLabel[role] ?? role}
        </span>
        <span className="text-xs text-slate-300">{usuarios.length}</span>
        <div className="h-px bg-slate-100 flex-1" />
      </div>
      <div className="space-y-2">
        {usuarios.map((u) => (
          <UsuarioCard key={u.id} usuario={u} isCurrentUser={u.id === currentUserId} />
        ))}
      </div>
    </div>
  );
}

export function UsuariosLista() {
  const { user } = useProfile();
  const { data, error, isError, isLoading } = useUsuarios();

  if (isLoading) {
    return <ListSkeletonRows rows={4} />;
  }

  if (isError) {
    return <QueryErrorState message={error.message} />;
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="Nenhum usuário encontrado"
        description="Quando novos usuários forem cadastrados, eles aparecerão agrupados por perfil de acesso."
      />
    );
  }

  const porRole = roleOrder.reduce<Record<string, Profile[]>>((acc, role) => {
    acc[role] = data.filter((u) => u.role === role);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {roleOrder.map((role) => (
        <RoleSection
          key={role}
          role={role}
          usuarios={porRole[role] ?? []}
          currentUserId={user?.id}
        />
      ))}
    </div>
  );
}

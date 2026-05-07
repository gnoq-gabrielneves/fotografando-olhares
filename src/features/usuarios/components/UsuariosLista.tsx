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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { Trash2 } from "lucide-react";
import { useExcluirUsuario, useUsuarios } from "../hooks/use-users";
import { EditarUsuarioSheet } from "./EditarUsuarioSheet";

const roleLabel: Record<string, string> = {
  admin: "Administrador",
  extensionista: "Extensionista",
  laudador: "Laudador",
};

const roleBadge: Record<string, string> = {
  admin: "bg-violet-950 text-violet-400 border border-violet-900/50",
  extensionista: "bg-cyan-950 text-cyan-400 border border-cyan-900/50",
  laudador: "bg-amber-950 text-amber-400 border border-amber-900/50",
};

function formatarData(data: string) {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function UsuariosLista() {
  const { user } = useProfile();
  const { data, isLoading } = useUsuarios();
  const { mutate: deletar } = useExcluirUsuario();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 animate-pulse"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-40 bg-slate-800 rounded" />
              <div className="h-3 w-24 bg-slate-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data?.map((usuario) => {
        const initials = usuario.full_name
          .split(" ")
          .slice(0, 2)
          .map((n: string) => n[0])
          .join("")
          .toUpperCase();

        const isCurrentUser = usuario.id === user?.id;

        return (
          <div
            key={usuario.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Avatar + info principal */}
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="w-10 h-10 border border-slate-700 shrink-0">
                  <AvatarImage src={usuario.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-cyan-950 text-cyan-400 text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-medium truncate">
                      {usuario.full_name}
                    </span>
                    {isCurrentUser && (
                      <span className="text-xs text-slate-500">(você)</span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-medium border ${roleBadge[usuario.role] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}
                    >
                      {roleLabel[usuario.role] ?? usuario.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-slate-500">
                      Criado em {formatarData(usuario.created_at)}
                    </span>
                    {usuario.updated_at !== usuario.created_at && (
                      <>
                        <span className="text-slate-700 text-xs">·</span>
                        <span className="text-xs text-slate-500">
                          Atualizado em {formatarData(usuario.updated_at)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-1 shrink-0">
                <EditarUsuarioSheet usuario={usuario} />

                {!isCurrentUser && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-500 hover:text-red-400 hover:bg-red-950/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border-slate-800 !max-w-xs w-[calc(100%-2rem)] p-6 rounded-xl">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-950 border border-red-900/50 mx-auto mb-4">
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </div>
                      <AlertDialogHeader className="text-center space-y-1">
                        <AlertDialogTitle className="text-white text-base">
                          Excluir usuário?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 text-sm">
                          A conta de{" "}
                          <span className="text-white font-medium">
                            {usuario.full_name}
                          </span>{" "}
                          será excluída permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-4 flex gap-2 sm:flex-row">
                        <AlertDialogCancel className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
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
          </div>
        );
      })}
    </div>
  );
}

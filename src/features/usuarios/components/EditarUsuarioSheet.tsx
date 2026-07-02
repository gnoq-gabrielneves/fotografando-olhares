"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { formatDisplayTextOrDash } from "@/shared/lib/format/text";
import { Profile } from "@/shared/types";
import { Pencil, UserCog } from "lucide-react";
import { useState } from "react";
import { EditarUsuarioForm } from "./EditarUsuarioForm";

type Props = {
  usuario: Profile;
};

export function EditarUsuarioSheet({ usuario }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0 bg-white border-slate-200 w-[calc(100vw-2rem)] max-w-2xl sm:max-w-2xl max-h-[90vh] flex flex-col">
        <VisuallyHidden><DialogTitle>Editar usuário</DialogTitle></VisuallyHidden>
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
              <UserCog className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Editar usuário</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {formatDisplayTextOrDash(usuario.full_name)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-5">
          <EditarUsuarioForm usuario={usuario} onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

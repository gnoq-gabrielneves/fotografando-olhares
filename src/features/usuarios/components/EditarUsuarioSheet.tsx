"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Profile } from "@/types";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { EditarUsuarioForm } from "./EditarUsuarioForm";

type Props = {
  usuario: Profile;
};

export function EditarUsuarioSheet({ usuario }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white border-slate-200 text-slate-800 w-full sm:max-w-lg overflow-y-auto px-6">
        <SheetHeader className="mb-6 pt-2">
          <SheetTitle className="text-slate-800">Editar usuário</SheetTitle>
          <SheetDescription className="text-slate-500">
            Atualize os dados de {usuario.full_name}.
          </SheetDescription>
        </SheetHeader>
        <EditarUsuarioForm usuario={usuario} onSuccess={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

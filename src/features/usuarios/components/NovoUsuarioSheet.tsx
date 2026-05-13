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
import { Plus } from "lucide-react";
import { useState } from "react";
import { NovoUsuarioForm } from "./NovoUsuarioForm";

export function NovoUsuarioSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2">
          <Plus className="w-4 h-4" />
          Novo usuário
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white border-slate-200 text-slate-800 w-full sm:max-w-lg overflow-y-auto px-6">
        <SheetHeader className="mb-6 pt-2">
          <SheetTitle className="text-slate-800">Criar usuário</SheetTitle>
          <SheetDescription className="text-slate-500">
            Preencha os dados para criar um novo usuário no sistema.
          </SheetDescription>
        </SheetHeader>
        <NovoUsuarioForm onSuccess={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

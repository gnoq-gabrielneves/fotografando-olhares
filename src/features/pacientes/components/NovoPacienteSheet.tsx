"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { useState } from "react";
import { NovoPacienteForm } from "./NovoPacienteForm";

export function NovoPacienteSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2">
          <Plus className="w-4 h-4" />
          Novo paciente
        </Button>
      </SheetTrigger>
      <SheetContent
        showCloseButton={false}
        className="bg-slate-900 pt-5 border-slate-800 text-white w-full sm:max-w-lg overflow-y-auto px-6"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="text-white"></SheetTitle>
        </SheetHeader>
        <NovoPacienteForm onSuccess={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

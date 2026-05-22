"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { NovoPacienteForm } from "./NovoPacienteForm";

export function NovoPacienteSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2">
          <Plus className="w-4 h-4" />
          Novo paciente
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-slate-200 text-slate-800 min-w-[60vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="bg-blue-400 px-5 py-6">
          <DialogTitle className="text-slate-800">Novo paciente</DialogTitle>
        </DialogHeader>
        <div className="px-5">
          <NovoPacienteForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { Loader2, Plus, Puzzle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { useCriarModuloClinico } from "../hooks/use-developer-modules";
import { slugifyOrganization } from "../lib/organization-slug";

export function CreateClinicalModuleDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [description, setDescription] = useState("");
  const [idTouched, setIdTouched] = useState(false);

  const { mutate, isPending } = useCriarModuloClinico(() => {
    setOpen(false);
    setName("");
    setId("");
    setSpecialty("");
    setDescription("");
    setIdTouched(false);
  });

  function handleNameChange(value: string) {
    setName(value);
    if (!idTouched) setId(slugifyOrganization(value));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate({ id, name, specialty, description });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-slate-200 bg-white">
          <Plus className="h-4 w-4" />
          Novo módulo
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-violet-100 bg-violet-50">
              <Puzzle className="h-5 w-5 text-violet-700" />
            </div>
            <DialogTitle className="text-slate-800">
              Novo módulo clínico
            </DialogTitle>
            <DialogDescription>
              Cadastre uma especialidade que poderá ser habilitada por organização.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">
                Nome do módulo
              </label>
              <Input
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                placeholder="Ex: Cardio"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">
                Identificador
              </label>
              <Input
                value={id}
                onChange={(event) => {
                  setIdTouched(true);
                  setId(slugifyOrganization(event.target.value));
                }}
                placeholder="cardio"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">
                Especialidade
              </label>
              <Input
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
                placeholder="Cardiologia"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">
                Descrição
              </label>
              <Input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Fluxos, documentos e indicadores de cardiologia."
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-cyan-600 text-white hover:bg-cyan-500"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Criar módulo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

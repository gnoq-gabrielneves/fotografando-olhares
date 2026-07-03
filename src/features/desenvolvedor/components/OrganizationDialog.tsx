"use client";

import { useState } from "react";
import { Building2, Loader2, Pencil, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { OrganizationStatus } from "@/shared/types";
import {
  useAtualizarOrganizacao,
  useCriarOrganizacao,
} from "../hooks/use-developer-modules";
import { slugifyOrganization } from "../lib/organization-slug";

type OrganizationFormState = {
  name: string;
  slug: string;
  status: OrganizationStatus;
};

type OrganizationDialogProps =
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      organization: {
        id: string;
        name: string;
        slug: string;
        status: OrganizationStatus;
      };
    };

export function OrganizationDialog(props: OrganizationDialogProps) {
  const [open, setOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState<OrganizationFormState>(() =>
    props.mode === "edit"
      ? {
          name: props.organization.name,
          slug: props.organization.slug,
          status: props.organization.status,
        }
      : { name: "", slug: "", status: "active" },
  );

  const criarOrganizacao = useCriarOrganizacao(() => {
    setOpen(false);
    setForm({ name: "", slug: "", status: "active" });
    setSlugTouched(false);
  });

  const atualizarOrganizacao = useAtualizarOrganizacao(() => {
    setOpen(false);
  });

  const isPending = criarOrganizacao.isPending || atualizarOrganizacao.isPending;
  const isEditing = props.mode === "edit";

  function setName(name: string) {
    setForm((current) => ({
      ...current,
      name,
      slug: slugTouched ? current.slug : slugifyOrganization(name),
    }));
  }

  function setSlug(slug: string) {
    setSlugTouched(true);
    setForm((current) => ({
      ...current,
      slug: slugifyOrganization(slug),
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (props.mode === "edit") {
      atualizarOrganizacao.mutate({
        id: props.organization.id,
        ...form,
      });
      return;
    }

    criarOrganizacao.mutate({
      name: form.name,
      slug: form.slug,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
        ) : (
          <Button className="bg-cyan-600 text-white hover:bg-cyan-500">
            <Plus className="h-4 w-4" />
            Nova organização
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-white">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50">
              <Building2 className="h-5 w-5 text-cyan-700" />
            </div>
            <DialogTitle className="text-slate-800">
              {isEditing ? "Editar organização" : "Nova organização"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Atualize os dados cadastrais da instituição cliente."
                : "Crie uma instituição cliente. Os módulos podem ser habilitados depois."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">
                Nome da organização
              </label>
              <Input
                value={form.name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex: Clínica São Lucas"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">
                Identificador
              </label>
              <Input
                value={form.slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="clinica-sao-lucas"
                required
                disabled={isPending}
              />
              <p className="text-xs text-slate-400">
                Usado internamente para identificar a organização.
              </p>
            </div>

            {isEditing ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Status
                </label>
                <Select
                  value={form.status}
                  onValueChange={(status: OrganizationStatus) =>
                    setForm((current) => ({ ...current, status }))
                  }
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-600">
                  Nenhum módulo será habilitado automaticamente.
                </p>
              </div>
            )}
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
              {isEditing ? "Salvar alterações" : "Criar organização"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

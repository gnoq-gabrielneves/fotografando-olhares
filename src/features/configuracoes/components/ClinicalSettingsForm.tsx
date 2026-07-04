"use client";

import { useMemo, useState } from "react";
import { Building2, ImageUp, Loader2, Save, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useAvatarUpload } from "@/shared/hooks/use-avatar";
import { toast } from "sonner";
import {
  useClinicalSettings,
  useSalvarClinicalSettings,
} from "../hooks/use-clinical-settings";

type FormState = {
  clinic_name: string;
  clinic_logo_url: string;
  clinic_city: string;
  physician_name: string;
  physician_crm: string;
};

const emptyForm: FormState = {
  clinic_name: "",
  clinic_logo_url: "",
  clinic_city: "",
  physician_name: "",
  physician_crm: "",
};

const fieldClass =
  "h-10 w-full border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:ring-cyan-500";
const labelClass = "text-xs font-medium text-slate-500";

export function ClinicalSettingsForm() {
  const { data, isLoading } = useClinicalSettings();
  const { mutate, isPending } = useSalvarClinicalSettings();
  const { upload, isUploading } = useAvatarUpload({
    folder: "clinical-logos",
    maxWidth: 600,
  });
  const [draft, setDraft] = useState<FormState | null>(null);

  const savedForm = useMemo<FormState>(
    () =>
      data
        ? {
      clinic_name: data.clinic_name ?? "",
      clinic_logo_url: data.clinic_logo_url ?? "",
      clinic_city: data.clinic_city ?? "",
      physician_name: data.physician_name ?? "",
      physician_crm: data.physician_crm ?? "",
          }
        : emptyForm,
    [data],
  );

  const form = draft ?? savedForm;

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(savedForm),
    [form, savedForm],
  );

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setDraft((current) => ({ ...(current ?? savedForm), [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate(form, {
      onSuccess: () => setDraft(null),
    });
  }

  async function handleLogoFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const url = await upload(file);
      set("clinic_logo_url", url);
      toast.success("Logo carregado");
    } catch (error) {
      toast.error("Erro ao carregar logo", {
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  }

  const isBusy = isPending || isUploading;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Identidade clínica
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Essas informações aparecem nos documentos clínicos emitidos pela organização.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className={labelClass}>Nome da clínica ou hospital</label>
            <Input
              value={form.clinic_name}
              onChange={(event) => set("clinic_name", event.target.value)}
              placeholder="Ex: Clínica Médica São Lucas"
              className={fieldClass}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className={labelClass}>Logo da clínica</label>
            <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
                {form.clinic_logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.clinic_logo_url}
                    alt=""
                    className="h-full w-full rounded-lg object-contain p-2"
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-slate-300" />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isBusy}
                    className="bg-white"
                    asChild
                  >
                    <label className="cursor-pointer">
                      {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ImageUp className="mr-2 h-4 w-4" />
                      )}
                      Enviar logo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoFile}
                      />
                    </label>
                  </Button>
                  {form.clinic_logo_url ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isBusy}
                      className="bg-white text-slate-500"
                      onClick={() => set("clinic_logo_url", "")}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remover
                    </Button>
                  ) : null}
                </div>
                <Input
                  value={form.clinic_logo_url}
                  onChange={(event) =>
                    set("clinic_logo_url", event.target.value)
                  }
                  placeholder="URL do logo, caso queira colar manualmente"
                  className={fieldClass}
                />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Cidade da emissão</label>
            <Input
              value={form.clinic_city}
              onChange={(event) => set("clinic_city", event.target.value)}
              placeholder="Ex: Fortaleza"
              className={fieldClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>CRM da médica</label>
            <Input
              value={form.physician_crm}
              onChange={(event) => set("physician_crm", event.target.value)}
              placeholder="Ex: CRM-CE 00000"
              className={fieldClass}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className={labelClass}>Nome da médica responsável</label>
            <Input
              value={form.physician_name}
              onChange={(event) => set("physician_name", event.target.value)}
              placeholder="Dra. Nome Sobrenome"
              className={fieldClass}
            />
          </div>
        </div>

        <p className="text-xs text-slate-400">
          {isPending
            ? "Salvando configurações..."
            : isDirty
              ? "Existem alterações não salvas."
              : "Configurações atualizadas."}
        </p>

        <Button
          type="submit"
          disabled={isBusy || !isDirty}
          className="bg-cyan-600 text-white hover:bg-cyan-500"
        >
          {isBusy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar configurações
        </Button>
      </section>

      <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Prévia do cabeçalho
        </p>
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            {form.clinic_logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.clinic_logo_url}
                alt=""
                className="h-12 w-12 rounded-md border border-slate-200 bg-white object-contain p-1"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-cyan-100 bg-cyan-50 text-cyan-700">
                <Building2 className="h-5 w-5" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {form.clinic_name || "Nome da clínica/hospital"}
              </p>
              <p className="text-xs text-slate-500">
                {form.clinic_city || "Cidade"} · data da emissão
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-300 pt-3 text-center">
            <p className="text-sm font-medium text-slate-800">
              {form.physician_name || "Nome da médica"}
            </p>
            <p className="text-xs text-slate-500">
              {form.physician_crm || "CRM"}
            </p>
          </div>
        </div>
      </aside>
    </form>
  );
}

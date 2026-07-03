"use server";

import { createClient } from "@/shared/lib/supabase/server";
import type { ClinicalModule, Organization, OrganizationModule } from "@/shared/types";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export type DeveloperModulesData = {
  organizations: Pick<Organization, "id" | "name" | "slug" | "status">[];
  clinicalModules: Pick<
    ClinicalModule,
    "id" | "name" | "specialty" | "description" | "status"
  >[];
  organizationModules: Pick<
    OrganizationModule,
    "organization_id" | "module_id" | "status" | "enabled_at"
  >[];
};

type AtualizarModuloInput = {
  organization_id: string;
  module_id: string;
  enabled: boolean;
};

export type CriarOrganizacaoInput = {
  name: string;
  slug: string;
};

export type AtualizarOrganizacaoInput = {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
};

export type CriarModuloClinicoInput = {
  id: string;
  name: string;
  specialty: string;
  description?: string;
};

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function verificarDeveloper() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (profile?.role !== "developer") {
    throw new Error("Apenas desenvolvedores podem gerenciar licenças");
  }
}

export async function listarModulosPorOrganizacao(): Promise<DeveloperModulesData> {
  await verificarDeveloper();
  const admin = getAdminClient();

  const [organizationsResult, modulesResult, organizationModulesResult] =
    await Promise.all([
      admin
        .from("organizations")
        .select("id, name, slug, status")
        .order("name", { ascending: true }),
      admin
        .from("clinical_modules")
        .select("id, name, specialty, description, status")
        .order("name", { ascending: true }),
      admin
        .from("organization_modules")
        .select("organization_id, module_id, status, enabled_at")
        .order("enabled_at", { ascending: true }),
    ]);

  if (organizationsResult.error) throw new Error(organizationsResult.error.message);
  if (modulesResult.error) throw new Error(modulesResult.error.message);
  if (organizationModulesResult.error) {
    throw new Error(organizationModulesResult.error.message);
  }

  return {
    organizations: organizationsResult.data ?? [],
    clinicalModules: modulesResult.data ?? [],
    organizationModules: organizationModulesResult.data ?? [],
  };
}

export async function atualizarModuloDaOrganizacao(input: AtualizarModuloInput) {
  await verificarDeveloper();
  const admin = getAdminClient();

  if (input.enabled) {
    const { error } = await admin.from("organization_modules").upsert(
      {
        organization_id: input.organization_id,
        module_id: input.module_id,
        status: "active",
        enabled_at: new Date().toISOString(),
      },
      { onConflict: "organization_id,module_id" },
    );

    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await admin
    .from("organization_modules")
    .update({ status: "inactive" })
    .eq("organization_id", input.organization_id)
    .eq("module_id", input.module_id);

  if (error) throw new Error(error.message);
}

export async function criarOrganizacao(input: CriarOrganizacaoInput) {
  await verificarDeveloper();
  const admin = getAdminClient();

  const name = input.name.trim();
  const slug = input.slug.trim().toLowerCase();

  if (!name) throw new Error("Informe o nome da organização");
  if (!slug) throw new Error("Informe o identificador da organização");

  const { data, error } = await admin
    .from("organizations")
    .insert({
      name,
      slug,
      status: "active",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Já existe uma organização com esse identificador");
    }
    throw new Error(error.message);
  }

  return data.id as string;
}

export async function atualizarOrganizacao(input: AtualizarOrganizacaoInput) {
  await verificarDeveloper();
  const admin = getAdminClient();

  const name = input.name.trim();
  const slug = input.slug.trim().toLowerCase();

  if (!input.id) throw new Error("Organização inválida");
  if (!name) throw new Error("Informe o nome da organização");
  if (!slug) throw new Error("Informe o identificador da organização");

  const { error } = await admin
    .from("organizations")
    .update({
      name,
      slug,
      status: input.status,
    })
    .eq("id", input.id);

  if (error) {
    if (error.code === "23505") {
      throw new Error("Já existe uma organização com esse identificador");
    }
    throw new Error(error.message);
  }
}

export async function criarModuloClinico(input: CriarModuloClinicoInput) {
  await verificarDeveloper();
  const admin = getAdminClient();

  const id = input.id.trim().toLowerCase();
  const name = input.name.trim();
  const specialty = input.specialty.trim();
  const description = input.description?.trim() || null;

  if (!id) throw new Error("Informe o identificador do módulo");
  if (!name) throw new Error("Informe o nome do módulo");
  if (!specialty) throw new Error("Informe a especialidade");

  const { error } = await admin.from("clinical_modules").insert({
    id,
    name,
    specialty,
    description,
    status: "active",
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("Já existe um módulo com esse identificador");
    }
    throw new Error(error.message);
  }
}

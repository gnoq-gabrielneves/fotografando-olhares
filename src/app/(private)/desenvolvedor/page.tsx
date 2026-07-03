import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DeveloperModulesManager } from "@/features/desenvolvedor/components/DeveloperModulesManager";
import { createClient } from "@/shared/lib/supabase/server";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Licenças | Fotografando Olhares",
  description: "Administração de módulos clínicos por organização.",
};

export default async function DesenvolvedorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "developer") redirect("/home");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldCheck}
        title="Licenças"
        description="Gerencie os módulos clínicos habilitados por organização"
      />
      <DeveloperModulesManager />
    </div>
  );
}

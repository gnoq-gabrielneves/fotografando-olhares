import type { Metadata } from "next";
import { DevblogTimeline } from "@/features/devblog/components/DevblogTimeline";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "Novidades | Fotografando Olhares",
  description: "Devblog e patch notes do sistema Fotografando Olhares.",
};

export default function DevblogPage() {
  return (
    <div className="w-full space-y-6">
      <PageHeader
        icon={Newspaper}
        title="Novidades"
        description="Devblog, patch notes e evolução do produto"
        meta={
          <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 ring-1 ring-cyan-100">
            Patch notes
          </span>
        }
      />

      <DevblogTimeline />
    </div>
  );
}

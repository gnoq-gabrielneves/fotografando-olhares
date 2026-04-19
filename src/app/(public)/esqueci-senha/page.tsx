import { ResetForm } from "@/features/esqueci-senha/components/reset-form";
import { Eye } from "lucide-react";

export default function EsqueciSenhaPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Circulo Decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full border border-cyan-900/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full border border-cyan-800/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-50 h-50 rounded-full border border-cyan-700/20" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-950 border border-cyan-800/50 mb-4">
            <Eye className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Fotografando Olhares
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Liga Acadêmica de Oftalmologia
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl shadow-black/40">
          <ResetForm />
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          ©2026 · Gabriel Neves
        </p>
      </div>
    </main>
  );
}

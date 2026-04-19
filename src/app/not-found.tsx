import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Circulo Decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full border border-cyan-900/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full border border-cyan-800/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-50 h-50 rounded-full border border-cyan-700/20" />
      </div>

      <div className="relative text-center space-y-6">
        {/* Ícone */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-950 border border-cyan-800/50">
          <Eye className="w-10 h-10 text-cyan-400 opacity-40" />
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-white tracking-tight">404</h1>
          <p className="text-slate-300 text-lg font-medium">
            Página não encontrada
          </p>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            A página que você está procurando não existe ou foi removida.
          </p>
        </div>

        {/* Botão voltar */}
        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o início
        </Link>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          ©2026 · Gabriel Neves
        </p>
      </div>
    </main>
  );
}

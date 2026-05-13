/* eslint-disable @next/next/no-img-element */
import { LoginForm } from "@/features/login/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="bg-slate-50 flex items-center justify-center p-4 min-h-screen">
      {/* Círculos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full border border-cyan-200/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full border border-cyan-300/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-50 h-50 rounded-full border border-cyan-400/30" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center">
          <img
            src="./fotografandoolhares.png"
            alt="Logo"
            className="mx-auto max-w-xs"
          />
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/60">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs mt-6">
          ©2026 · Gabriel Neves
        </p>
      </div>
    </div>
  );
}

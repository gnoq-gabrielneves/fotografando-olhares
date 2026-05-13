"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schemas/loginSchema";
import { LoginSchema } from "../types/login-types";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginSchema) {
    setServerError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError("E-mail ou senha incorretos. Tente novamente.");
      return;
    }

    router.push("/home");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* E-mail */}
      <div className="space-y-2">
        <label className="text-slate-600 text-sm font-medium">E-mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            {...register("email")}
            type="email"
            placeholder="seu@email.com"
            disabled={isSubmitting}
            className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 h-11"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      {/* Senha */}
      <div className="space-y-2">
        <label className="text-slate-600 text-sm font-medium">Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            disabled={isSubmitting}
            className="pl-10 pr-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 h-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
      </div>

      {/* Esqueci a senha */}
      <div className="flex justify-end">
        <a
          href="/esqueci-senha"
          className="text-xs text-cyan-600 hover:text-cyan-500 transition-colors"
        >
          Esqueci minha senha
        </a>
      </div>

      {/* Erro do servidor */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-red-600 text-sm">{serverError}</p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}

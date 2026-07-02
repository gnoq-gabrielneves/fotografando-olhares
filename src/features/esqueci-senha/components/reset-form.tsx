"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { resetPassword } from "@/features/esqueci-senha/actions/resetPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
});

type ResetSchema = z.infer<typeof resetSchema>;

export function ResetForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ResetSchema>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ResetSchema) {
    setServerError(null);
    try {
      await resetPassword(values.email);
      setSubmitted(true);
    } catch {
      setServerError("Não foi possível enviar o e-mail. Tente novamente.");
    }
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 border border-cyan-200">
          <CheckCircle className="w-6 h-6 text-cyan-600" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-slate-800">
            E-mail enviado!
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Enviamos um link de recuperação para
          </p>
          <p className="text-cyan-600 text-sm font-medium">
            {getValues("email")}
          </p>
        </div>
        <p className="text-slate-400 text-xs">
          Verifique sua caixa de entrada e a pasta de spam.
        </p>
        <a
          href="/login"
          className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-500 transition-colors mt-2"
        >
          <ArrowLeft className="w-3 h-3" />
          Voltar para o login
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1 mb-2">
        <h2 className="text-lg font-medium text-slate-800">Recuperar senha</h2>
        <p className="text-slate-500 text-sm">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
      </div>

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

      {/* Erro servidor */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-red-600 text-sm">{serverError}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar link de recuperação"
        )}
      </Button>

      <a
        href="/login"
        className="flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
      >
        <ArrowLeft className="w-3 h-3" />
        Voltar para o login
      </a>
    </form>
  );
}

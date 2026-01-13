"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { confirmPasswordReset } from "@/lib/api";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTenant = searchParams.get("tenant") || "demo";
  const token = searchParams.get("token") || "";
  const [tenantSlug, setTenantSlug] = useState(initialTenant);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!token) {
      setError("Token ausente ou inválido.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não conferem.");
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(tenantSlug, token, password);
      setMessage("Senha redefinida com sucesso. Você já pode entrar.");
      setTimeout(() => router.push("/login"), 800);
    } catch (err: any) {
      setError(err?.message || "Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Redefinir senha</h1>
          <p className="text-sm text-gray-600">Informe uma nova senha para sua conta.</p>
        </div>
        {message && (
          <div className="rounded border border-green-200 bg-green-50 p-2 text-sm text-green-700">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>
        )}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="tenant">
            Tenant
          </label>
          <input
            id="tenant"
            type="text"
            value={tenantSlug}
            onChange={(e) => setTenantSlug(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Nova senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="confirm">
            Confirmar senha
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black/80 disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Redefinir senha"}
        </button>
        <div className="text-sm text-gray-600">
          <Link href="/login" className="text-gray-900 underline">
            Voltar para login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

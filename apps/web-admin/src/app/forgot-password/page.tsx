"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("admin@evoluihub.local");
  const [tenantSlug, setTenantSlug] = useState("demo");
  const [message, setMessage] = useState<string | null>(null);
  const [debugToken, setDebugToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setDebugToken(null);
    try {
      const res = await requestPasswordReset(email, tenantSlug);
      setMessage("Se existir conta, enviaremos instruções de redefinição.");
      if (res.debugToken) {
        setDebugToken(res.debugToken);
      }
    } catch (err: any) {
      setError(err?.message || "Não foi possível enviar o reset.");
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
          <h1 className="text-2xl font-semibold text-gray-900">Esqueci minha senha</h1>
          <p className="text-sm text-gray-600">
            Informe seu e-mail para receber o link de redefinição.
          </p>
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
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            required
          />
        </div>
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
        {debugToken && (
          <div className="text-xs text-gray-600 border rounded border-gray-200 bg-gray-50 p-2">
            Debug token (dev): {debugToken}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black/80 disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar link"}
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

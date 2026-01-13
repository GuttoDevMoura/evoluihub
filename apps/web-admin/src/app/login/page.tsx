"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@evoluihub.local");
  const [password, setPassword] = useState("admin123");
  const [tenantSlug, setTenantSlug] = useState("demo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password, tenantSlug);
      router.push("/app");
    } catch (err: any) {
      setError(err?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Login Admin</h1>
          <p className="text-sm text-gray-600">Acesse com seu e-mail e senha.</p>
        </div>
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
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none bg-white pointer-events-auto"
            autoFocus
            disabled={false}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none bg-white pointer-events-auto"
            disabled={false}
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
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none bg-white pointer-events-auto"
            disabled={false}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black/80 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

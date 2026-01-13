"use client";

import { FormEvent, useState } from "react";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequirePlatformAdmin } from "@/components/admin/RequirePlatformAdmin";
import { inviteUser } from "@/lib/api";

export default function InviteUserPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("viewer");
  const [tenantSlug, setTenantSlug] = useState("demo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await inviteUser({ tenantSlug, email, name, role });
      setResult(res);
    } catch (err: any) {
      setError(err?.message || "Falha ao enviar convite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAdmin>
      <RequirePlatformAdmin>
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Convidar usuário</h1>
          {error && <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>}
          {result && (
            <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              Convite criado. Outbox ID: {result.emailOutboxId}, User ID: {result.appUserId}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3 rounded border border-gray-200 bg-white p-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Tenant</label>
              <input
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">E-mail</label>
              <input
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Nome</label>
              <input
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Role</label>
              <select
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black/80 disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar convite"}
            </button>
          </form>
        </div>
      </RequirePlatformAdmin>
    </RequireAdmin>
  );
}

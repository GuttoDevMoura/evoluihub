"use client";

import { useEffect, useState } from "react";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequirePlatformAdmin } from "@/components/admin/RequirePlatformAdmin";
import { getEmailOutbox, type EmailOutboxItem } from "@/lib/api";

const statuses = ["pending", "sending", "sent", "failed"];

export default function EmailOutboxPage() {
  const [status, setStatus] = useState<string>("failed");
  const [items, setItems] = useState<EmailOutboxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEmailOutbox(status);
      setItems(res);
    } catch (err: any) {
      setError(err?.message || "Falha ao carregar outbox");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [status]);

  return (
    <RequireAdmin>
      <RequirePlatformAdmin>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Outbox de E-mail</h1>
            <div className="flex items-center gap-2">
              <select
                className="rounded border border-gray-300 px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={() => void load()}
                className="rounded bg-gray-900 px-3 py-2 text-sm font-semibold text-white"
                disabled={loading}
              >
                {loading ? "Atualizando..." : "Atualizar"}
              </button>
            </div>
          </div>
          {error && <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>}
          <div className="overflow-auto rounded border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Template</th>
                  <th className="px-3 py-2">Para</th>
                  <th className="px-3 py-2">Assunto</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Erro</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-3 py-2">{item.id}</td>
                    <td className="px-3 py-2">{item.template_name || "-"}</td>
                    <td className="px-3 py-2">{item.to_email}</td>
                    <td className="px-3 py-2">{item.subject}</td>
                    <td className="px-3 py-2">{item.status}</td>
                    <td className="px-3 py-2 text-red-600">{item.last_error}</td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td className="px-3 py-2" colSpan={6}>
                      Nenhum registro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </RequirePlatformAdmin>
    </RequireAdmin>
  );
}

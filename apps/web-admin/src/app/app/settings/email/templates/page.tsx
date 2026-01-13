"use client";

import { useEffect, useState } from "react";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequirePlatformAdmin } from "@/components/admin/RequirePlatformAdmin";
import {
  getEmailConfig,
  getEmailTemplate,
  getEmailTemplates,
  updateEmailTemplate,
  type EmailTemplateDetail,
  type EmailTemplateSummary,
} from "@/lib/api";

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplateSummary[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<EmailTemplateDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<{ fromEmail?: string | null; relayConfigured?: boolean }>({});

  useEffect(() => {
    const load = async () => {
      try {
        const [tpls, cfg] = await Promise.all([getEmailTemplates(), getEmailConfig()]);
        setTemplates(tpls);
        setConfig(cfg);
        if (tpls.length) {
          setSelected(tpls[0].name);
        }
      } catch (err: any) {
        setError(err?.message || "Falha ao carregar templates");
      }
    };
    void load();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    getEmailTemplate(selected)
      .then(setDetail)
      .catch((err) => setError(err?.message || "Falha ao carregar template"))
      .finally(() => setLoading(false));
  }, [selected]);

  const handleSave = async () => {
    if (!detail) return;
    setSaving(true);
    setError(null);
    try {
      await updateEmailTemplate(detail.name, {
        subject: detail.subject,
        body_html: detail.body_html,
        body_text: detail.body_text,
        status: detail.status,
      });
    } catch (err: any) {
      setError(err?.message || "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RequireAdmin>
      <RequirePlatformAdmin>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold">Templates de E-mail</h1>
            {config && (
              <div className="text-sm text-gray-700">
                Remetente: {config.fromEmail || "N/A"} · Relay:{" "}
                {config.relayConfigured ? "configurado" : "não configurado"}
              </div>
            )}
          </div>
          {error && <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>}
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
            <div className="space-y-2 rounded border border-gray-200 bg-white p-3">
              <div className="text-sm font-semibold text-gray-800">Templates</div>
              <div className="space-y-1">
                {templates.map((tpl) => (
                  <button
                    key={tpl.name}
                    onClick={() => setSelected(tpl.name)}
                    className={`w-full rounded px-3 py-2 text-left text-sm ${
                      selected === tpl.name ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                    }`}
                  >
                    <div>{tpl.name}</div>
                    <div className="text-xs text-gray-600">{tpl.status}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded border border-gray-200 bg-white p-4 space-y-3">
              {loading && <div className="text-sm text-gray-600">Carregando...</div>}
              {detail && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assunto</label>
                    <input
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                      value={detail.subject}
                      onChange={(e) => setDetail({ ...detail, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <input
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                      value={detail.status}
                      onChange={(e) => setDetail({ ...detail, status: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Body HTML</label>
                    <textarea
                      className="w-full min-h-[140px] rounded border border-gray-300 px-3 py-2 text-sm"
                      value={detail.body_html}
                      onChange={(e) => setDetail({ ...detail, body_html: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Body Text</label>
                    <textarea
                      className="w-full min-h-[100px] rounded border border-gray-300 px-3 py-2 text-sm"
                      value={detail.body_text}
                      onChange={(e) => setDetail({ ...detail, body_text: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black/80 disabled:opacity-60"
                  >
                    {saving ? "Salvando..." : "Salvar"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </RequirePlatformAdmin>
    </RequireAdmin>
  );
}

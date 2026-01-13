"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

type NavItem = { href: string; label: string };
type Section = { label: string; items: NavItem[] };

const sections: Section[] = [
  {
    label: "Dashboard",
    items: [{ href: "/app/dashboard", label: "Visão geral" }],
  },
  {
    label: "Conteúdo",
    items: [
      { href: "/app/products", label: "Produtos" },
      { href: "/app/media", label: "Mídia" },
      { href: "/app/member-areas", label: "Áreas de membros" },
    ],
  },
  {
    label: "Operação",
    items: [
      { href: "/app/members", label: "Membros" },
      { href: "/app/enrollments", label: "Matrículas" },
      { href: "/app/access-groups", label: "Grupos de acesso" },
      { href: "/app/cohorts", label: "Turmas" },
      { href: "/app/progress", label: "Progresso" },
    ],
  },
  {
    label: "Comunidade & Gamificação",
    items: [
      { href: "/app/community", label: "Comunidade" },
      { href: "/app/challenges", label: "Desafios" },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { href: "/app/pay/account", label: "Conta" },
      { href: "/app/pay/transactions", label: "Transações" },
      { href: "/app/pay/subscriptions", label: "Assinaturas" },
      { href: "/app/pay/coupons", label: "Cupons" },
      { href: "/app/pay/payouts", label: "Repasses" },
    ],
  },
  {
    label: "Relatórios",
    items: [
      { href: "/app/reports/overview", label: "Visão geral" },
      { href: "/app/reports/sales", label: "Vendas" },
      { href: "/app/reports/progress", label: "Progresso" },
      { href: "/app/reports/gamification", label: "Gamificação" },
      { href: "/app/reports/exports", label: "Exportações" },
    ],
  },
  {
    label: "Comunicação",
    items: [
      { href: "/app/comms/templates", label: "Templates" },
      { href: "/app/comms/outbox", label: "Outbox" },
      { href: "/app/comms/campaigns", label: "Campanhas" },
    ],
  },
  {
    label: "IA",
    items: [
      { href: "/app/ai/agents", label: "Agentes" },
      { href: "/app/ai/conversations", label: "Conversas" },
      { href: "/app/ai/settings", label: "Configurações IA" },
    ],
  },
  {
    label: "Integrações & Webhooks",
    items: [
      { href: "/app/integrations", label: "Integrações" },
      { href: "/app/integrations/logs", label: "Logs" },
      { href: "/app/webhooks", label: "Webhooks" },
    ],
  },
  {
    label: "Configurações",
    items: [
      { href: "/app/settings/org", label: "Organização" },
      { href: "/app/settings/users", label: "Usuários" },
      { href: "/app/settings/roles", label: "Papéis" },
      { href: "/app/settings/branding", label: "Branding" },
      { href: "/app/settings/email-relay", label: "Relay de e-mail" },
      { href: "/app/settings/email/templates", label: "Templates de e-mail" },
      { href: "/app/settings/email/outbox", label: "Outbox de e-mail" },
      { href: "/app/settings/email/invite", label: "Convites" },
      { href: "/app/settings/audit", label: "Auditoria" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    sections.reduce<Record<string, boolean>>((acc, section) => {
      acc[section.label] = true;
      return acc;
    }, {}),
  );

  const toggle = (label: string) => {
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="border-r border-gray-200 p-4 space-y-4 bg-white">
      <div className="text-lg font-semibold">EvoluiHub Admin</div>
      <nav className="space-y-3">
        {sections.map((section) => (
          <div key={section.label} className="space-y-1">
            <button
              type="button"
              onClick={() => toggle(section.label)}
              className="flex w-full items-center justify-between text-xs font-semibold uppercase text-gray-500"
            >
              <span>{section.label}</span>
              <span className="text-gray-400">{open[section.label] ? "▾" : "▸"}</span>
            </button>
            {open[section.label] && (
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block rounded px-3 py-2 text-sm transition ${
                        active
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

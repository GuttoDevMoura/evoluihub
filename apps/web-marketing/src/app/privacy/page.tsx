"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 text-slate-800">
      <div className="space-y-4 rounded-3xl border border-blue-50 bg-white p-8 shadow-sm shadow-blue-50">
        <h1 className="text-3xl font-bold text-slate-900">Política de Privacidade (stub)</h1>
        <p className="text-sm text-slate-600">
          Esta página é um placeholder para a política de privacidade do EvoluiHub. Personalize este texto conforme as
          diretrizes legais da sua organização.
        </p>
        <p className="text-sm text-slate-600">
          O EvoluiHub trata dados com foco em segurança e governança. Revise os termos de coleta, uso e proteção de
          dados antes de publicar.
        </p>
        <Link href="/" className="text-sm font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-800">
          Voltar para a página inicial
        </Link>
      </div>
    </main>
  );
}

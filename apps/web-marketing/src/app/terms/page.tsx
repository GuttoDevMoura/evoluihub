"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 text-slate-800">
      <div className="space-y-4 rounded-3xl border border-blue-50 bg-white p-8 shadow-sm shadow-blue-50">
        <h1 className="text-3xl font-bold text-slate-900">Termos de Uso (stub)</h1>
        <p className="text-sm text-slate-600">
          Este é um placeholder para os termos de uso do EvoluiHub. Adapte este conteúdo com as condições, direitos e
          responsabilidades dos usuários e da plataforma.
        </p>
        <p className="text-sm text-slate-600">
          Inclua orientações sobre licenças, propriedade intelectual, suporte e limitações de responsabilidade conforme
          sua política jurídica.
        </p>
        <Link href="/" className="text-sm font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-800">
          Voltar para a página inicial
        </Link>
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  Trophy,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const benefits = [
  {
    title: "Tudo em um só lugar",
    text: "Cursos, alunos, progresso, gamificação, comunicação e gestão em uma única plataforma integrada.",
    icon: <Workflow className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Experiência que engaja",
    text: "Gamificação, desafios, conquistas e ranking que aumentam o engajamento e a constância do aluno.",
    icon: <Sparkles className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Gestão inteligente",
    text: "Tenha controle total com permissões, relatórios e visão clara do crescimento educacional.",
    icon: <Target className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Escalável desde o início",
    text: "Pensado para crescer com você — de poucos alunos a grandes comunidades.",
    icon: <Users className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Seguro e confiável",
    text: "Autenticação robusta, controle de acesso e arquitetura preparada para produção.",
    icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Plano de Gamificação",
    text: "Estruture missões, conquistas e recompensas para guiar o aluno em jornadas motivadoras e mensuráveis.",
    icon: <Trophy className="h-6 w-6 text-blue-600" />,
  },
];

const features = [
  "Gestão de cursos e aulas",
  "Área do aluno moderna e intuitiva",
  "Gamificação com XP, níveis e conquistas",
  "Desafios semanais e ranking",
  "Controle de permissões e papéis (RBAC)",
  "Comunicação por e-mail e convites",
  "Painel administrativo completo",
  "Arquitetura pronta para integrações futuras",
];

const steps = [
  "Crie sua conta e configure sua organização",
  "Cadastre cursos, conteúdos e usuários",
  "Acompanhe progresso, engajamento e resultados em tempo real",
];

const testimonials = [
  "“Plataforma intuitiva e extremamente organizada.”",
  "“A gamificação mudou a forma como os alunos se envolvem.”",
  "“Finalmente conseguimos ter visão clara do progresso.”",
];

const plans = ["Essencial", "Profissional", "Enterprise"];

export default function Home() {
  const slides = useMemo(
    () => [
      {
        title: "Gamificação que engaja",
        text: "XP, níveis, conquistas e desafios que aumentam a motivação e a constância de estudo.",
        ctaLabel: "Ver gamificação",
        icon: <Trophy className="h-5 w-5" />,
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Venda cursos avulsos",
        text: "Estruture catálogos e ofertas para vender cursos individuais no seu próprio hub.",
        ctaLabel: "Explorar vendas",
        icon: <ShoppingBag className="h-5 w-5" />,
        image:
          "https://images.unsplash.com/photo-1552960562-daf630e9278b?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Área do aluno tipo streaming",
        text: "Experiência moderna estilo catálogo: aulas, trilhas e conteúdos em um só lugar.",
        ctaLabel: "Ver área do aluno",
        icon: <PlayCircle className="h-5 w-5" />,
        image:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    [],
  );

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length);
  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 rounded-full border border-blue-50 bg-white/70 px-6 py-3 shadow-sm shadow-blue-50 backdrop-blur sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/Logo_OFC_EvoluiHub_.png"
              alt="EvoluiHub"
              width={210}
              height={54}
              className="h-[54px] w-auto"
              priority
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700">
            <Link href="/" className="hover:text-blue-700">
              Evolui Hub
            </Link>
            <Link href="#funcionalidades" className="hover:text-blue-700">
              Funcionalidades
            </Link>
            <Link href="#planos" className="hover:text-blue-700">
              Planos
            </Link>
            <Link href="http://localhost:3000/login" className="hover:text-blue-700">
              Acesso Parceiros
            </Link>
          </div>
        </div>
        <section className="relative mb-12 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg shadow-blue-100">
          <div className="relative h-full min-h-[480px]">
            {slides.map((slide, idx) => (
              <div
                key={slide.title}
                className={`absolute inset-0 transition-all duration-700 ${
                  idx === current ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/55 via-slate-900/35 to-slate-900/20" />
                <div className="absolute inset-0 flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:px-10">
                  <div className="max-w-xl rounded-3xl bg-white/90 p-6 shadow-lg shadow-blue-200 backdrop-blur">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                      {slide.icon}
                      <span>Funcionalidade EvoluiHub</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{slide.title}</h2>
                    <p className="mt-2 text-sm text-slate-700 sm:text-base">{slide.text}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href="#funcionalidades"
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                      >
                        {slide.ctaLabel}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="http://localhost:3001/login"
                        className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-white"
                      >
                        Ver como aluno
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-slate-800 shadow hover:scale-105"
              aria-label="Anterior"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-slate-800 shadow hover:scale-105"
              aria-label="Próximo"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 w-6 rounded-full transition ${
                    idx === current ? "bg-white shadow" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
        <header className="flex flex-col gap-4 text-center sm:gap-6">
          <div className="inline-flex items-center justify-center gap-2 self-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
            EvoluiHub • Plataforma Educacional Completa
          </div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
            Evolua a forma como você ensina, aprende e escala conhecimento.
          </h1>
          <p className="mx-auto max-w-3xl text-base text-slate-600 sm:text-lg">
            O EvoluiHub é uma plataforma completa de ensino online, gamificação e gestão educacional,
            criada para escolas, igrejas, empresas, comunidades e criadores de conteúdo que querem crescer com organização,
            dados e impacto real.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Link
                href="http://localhost:3000/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Acessar Plataforma (Admin)
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#funcionalidades"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
              >
                Conhecer Funcionalidades
              </Link>
              <Link
                href="http://localhost:3000/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
                title="Painel onde cada empresa cliente administra seu próprio ambiente"
              >
                Acesso parceiros
              </Link>
            </div>
            <Link
              href="http://localhost:3001/login"
              className="text-sm font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-800"
            >
              Acessar Aluno
            </Link>
          </div>
        </header>

        <section className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-blue-50 bg-white/80 p-6 shadow-sm shadow-blue-50 backdrop-blur"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </section>

        <section id="funcionalidades" className="mt-16 rounded-3xl bg-white/80 p-8 shadow-sm shadow-blue-50 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Recursos</p>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Funcionalidades que impulsionam resultados</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 rounded-xl border border-blue-50 bg-blue-50/40 p-3">
                <Zap className="mt-1 h-5 w-5 text-blue-600" />
                <span className="text-sm text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-8 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-500 p-8 text-white shadow-lg shadow-blue-100 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-50">Como funciona</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Começar é simples</h2>
            <p className="mt-3 text-sm text-blue-50/90">
              Em poucos passos você coloca sua organização para rodar com organização, dados e engajamento.
            </p>
          </div>
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={step} className="flex gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                  {idx + 1}
                </div>
                <div className="text-sm text-blue-50">{step}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="planos" className="mt-16 rounded-3xl border border-blue-50 bg-white p-8 shadow-sm shadow-blue-50">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Integrações</p>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Preparado para se integrar ao seu ecossistema</h2>
            <p className="text-sm text-slate-600">
              O EvoluiHub foi projetado para se integrar facilmente a ferramentas externas, APIs e automações,
              acompanhando a evolução do seu negócio.
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex h-20 items-center justify-center rounded-2xl border border-blue-50 bg-blue-50/60 text-sm font-semibold text-blue-700">
                Ícone genérico {i}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl bg-white p-8 shadow-sm shadow-blue-50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Depoimentos ilustrativos</p>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">O que as pessoas dizem</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((quote) => (
              <div key={quote} className="rounded-2xl border border-blue-50 bg-blue-50/50 p-4 text-sm text-slate-700">
                {quote}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-blue-50 bg-white p-8 shadow-sm shadow-blue-50">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Planos</p>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Planos que acompanham o seu crescimento</h2>
            <p className="text-sm text-slate-600">Entre em contato para conhecer o plano ideal para sua realidade.</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan} className="rounded-2xl border border-blue-50 bg-blue-50/60 p-5 text-center shadow-sm">
                <div className="text-sm font-semibold text-blue-700">{plan}</div>
                <p className="mt-2 text-xs text-slate-600">Entre em contato para conhecer o plano ideal.</p>
                <Link
                  href="mailto:contato@evoluihub.com"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-blue-700"
                >
                  Falar com a equipe
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl bg-white p-8 shadow-sm shadow-blue-50">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">FAQ</p>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Dúvidas frequentes</h2>
            <div className="space-y-3">
              {[
                {
                  q: "O EvoluiHub é uma plataforma EAD?",
                  a: "Sim, você pode publicar cursos e acompanhar o progresso dos alunos em uma experiência moderna e gamificada.",
                },
                {
                  q: "Posso usar para igrejas ou empresas?",
                  a: "Sim. O EvoluiHub atende escolas, igrejas, empresas e comunidades que precisam organizar e escalar conhecimento.",
                },
                {
                  q: "Existe limite de alunos?",
                  a: "A arquitetura é pensada para escalar conforme a demanda. Os planos se adaptam ao seu estágio de crescimento.",
                },
                {
                  q: "A plataforma é segura?",
                  a: "Sim. Autenticação robusta, RBAC e padrões de segurança fazem parte do core da aplicação.",
                },
                {
                  q: "Posso personalizar depois?",
                  a: "Sim. A plataforma foi projetada para evoluir com novas integrações, identidade visual e funcionalidades.",
                },
              ].map((item) => (
                <div key={item.q} className="rounded-2xl border border-blue-50 bg-blue-50/60 p-4">
                  <div className="text-sm font-semibold text-slate-900">{item.q}</div>
                  <div className="mt-1 text-sm text-slate-700">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-lg shadow-blue-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Comece a evoluir hoje</h2>
              <p className="text-sm text-blue-50/90">
                Organize, engaje e escale o conhecimento com uma plataforma feita para o futuro.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="http://localhost:3000/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-200 transition hover:bg-blue-50"
              >
                Acessar Plataforma
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="http://localhost:3001/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Acessar Aluno
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

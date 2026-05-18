import { createFileRoute } from "@tanstack/react-router";
import { useState, createContext, useContext } from "react";
import heroBg from "@/assets/bg.png";
import fpnLogo from "@/assets/fpn-logo.png";
import heroBgMobile from "@/assets/celular.png";
import mentorEvandro from "@/assets/fpn/mentors/mentor-evandro.jpg";
import mentorTiago from "@/assets/fpn/mentors/mentor-tiago.jpg";
import mentorMarcelo from "@/assets/fpn/mentors/mentor-marcelo.jpg";
import mentorFelipe from "@/assets/fpn/mentors/mentor-felipe.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Check,
  ChevronDown,
  Target,
  TrendingUp,
  Megaphone,
  DollarSign,
  Brain,
  Award,
  X,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Growth Day FPN Health — 06 de junho · Alphaville/SP" },
      {
        name: "description",
        content:
          "1 dia para começar a tratar sua clínica como negócio. Posicionamento, processo comercial, marketing e gestão para médicos. Vagas limitadas — R$ 197.",
      },
      { property: "og:title", content: "Growth Day FPN Health — 06/06/2025" },
      {
        property: "og:description",
        content:
          "Evento presencial em Alphaville. Médicos que querem parar de trabalhar muito e lucrar pouco.",
      },
    ],
  }),
  component: GrowthDayLanding,
});

const HUBLA_URL = "https://pay.hub.la/o6FAUrIfXXi7JXawYql9";
const WEBHOOK_URL =
  "https://projeto01-n8n.gmxuno.easypanel.host/webhook/e29fee45-b589-4d23-be68-4700f78aca74";
const FB_TOKEN =
  "EAALlfLwenuIBRQZBmnKvMJMmpU6x6auSFKqyGEjdZBmIJzIFpZCFUisoAWbbT3uY1AKDbMHNn5rsGHsVgQFw5aZAbqXvUQqpn4tZBPvDYhgl9hMIhZBXb1pi0ZAa2Gv2q4ZBV772ZAsS9Q7wtk8mTqnkHtPS0dezUcKuOs5O8kSp6iJFSEcajJkIHidsMBia0WifgaQZDZD";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const LeadModalContext = createContext<{ open: () => void }>({ open: () => {} });

function CTAButton({
  children = "Quero garantir minha vaga",
  size = "lg",
  pulse = false,
}: {
  children?: React.ReactNode;
  size?: "lg" | "md";
  pulse?: boolean;
}) {
  const { open } = useContext(LeadModalContext);
  return (
    <button
      type="button"
      onClick={open}
      className={`group inline-flex items-center justify-center gap-3 border border-[var(--teal-light)] bg-[var(--teal-light)] font-semibold uppercase tracking-[0.18em] text-[#091b3a] transition-all duration-300 hover:bg-transparent hover:text-[var(--teal-light)] hover:shadow-[var(--shadow-glow)] ${
        size === "lg" ? "px-9 py-4 text-xs sm:text-sm" : "px-6 py-3 text-[0.7rem]"
      } ${pulse ? "cta-pulse" : ""}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </button>
  );
}

function LeadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      window.fbq?.("track", "Lead", { content_name: "Growth Day FPN Health" });
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          source: "growth-day-landing",
          event: "Growth Day FPN Health",
          fb_access_token: FB_TOKEN,
          submitted_at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Webhook submit failed", err);
    } finally {
      window.location.href = HUBLA_URL;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md border border-white/15 bg-[#091b3a] p-8 shadow-2xl sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--teal-light)] to-transparent" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-foreground/55 transition-colors hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <div className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[var(--teal-light)]">
          Reserve sua vaga
        </div>
        <h3 className="mt-3 text-balance text-2xl font-light leading-tight tracking-tight">
          Garanta sua vaga no{" "}
          <span className="font-display font-medium italic text-[var(--teal-light)]">
            Growth Day
          </span>
        </h3>
        <p className="mt-3 text-sm font-light leading-relaxed text-foreground/65">
          Preencha seus dados para continuar para o checkout seguro do Hubla.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="lead-name" className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-foreground/55">
              Nome completo
            </label>
            <input
              id="lead-name"
              type="text"
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-white/15 bg-transparent px-4 py-3 text-sm font-light text-foreground outline-none transition-colors focus:border-[var(--teal-light)]"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label htmlFor="lead-email" className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-foreground/55">
              E-mail
            </label>
            <input
              id="lead-email"
              type="email"
              required
              maxLength={200}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-white/15 bg-transparent px-4 py-3 text-sm font-light text-foreground outline-none transition-colors focus:border-[var(--teal-light)]"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label htmlFor="lead-phone" className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-foreground/55">
              WhatsApp / Telefone
            </label>
            <input
              id="lead-phone"
              type="tel"
              required
              maxLength={30}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-white/15 bg-transparent px-4 py-3 text-sm font-light text-foreground outline-none transition-colors focus:border-[var(--teal-light)]"
              placeholder="(11) 99999-9999"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center gap-3 border border-[var(--teal-light)] bg-[var(--teal-light)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#091b3a] transition-all duration-300 hover:bg-transparent hover:text-[var(--teal-light)] hover:shadow-[var(--shadow-glow)] disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Enviando..." : "Continuar para o checkout"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Pagamento seguro via Hubla · Reembolso em 7 dias
          </p>
        </form>
      </div>
    </div>
  );
}

function UrgencyBar() {
  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black/40 py-2.5 text-center text-[0.65rem] backdrop-blur-md sm:text-xs">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-4 font-medium uppercase tracking-[0.22em] text-white/85">
        <img src={fpnLogo} alt="FPN Health" className="h-7 w-auto sm:h-8" />
        <span className="h-2.5 w-px bg-white/15" />
        <span className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-[var(--teal-light)]" strokeWidth={1.5} />
          06 jun
        </span>
        <span className="hidden h-2.5 w-px bg-white/15 sm:inline-block" />
        <span className="hidden items-center gap-2 sm:flex">
          <MapPin className="h-3 w-3 text-[var(--teal-light)]" strokeWidth={1.5} />
          Alphaville · Barueri/SP
        </span>
        <span className="hidden h-2.5 w-px bg-white/15 sm:inline-block" />
        <span className="flex items-center gap-2 text-[var(--teal-light)]">
          <span className="dot-pulse h-1 w-1 rounded-full bg-[var(--teal-light)]" />
          Vagas limitadas
        </span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[125vh] flex-col overflow-hidden bg-[#07182f] md:min-h-screen">
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${heroBgMobile})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden bg-center bg-cover bg-no-repeat md:block"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 lg:h-56"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(2,7,15,0.35) 45%, rgba(2,7,15,0.85) 80%, #02070f 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-5 sm:px-6 sm:pt-10 lg:px-8 lg:pt-16">
        <div className="max-w-xl">
          <div className="mb-8 inline-flex items-center gap-3 border border-white/25 bg-white/[0.04] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm">
            <span className="dot-pulse h-1 w-1 rounded-full bg-[var(--teal-light)]" />
            06 jun · Alphaville · SP
          </div>

          <h1 className="text-balance text-[2rem] font-light leading-[1.05] tracking-[-0.02em] text-white sm:text-[2.2rem] lg:text-[2.8rem] xl:text-[3.1rem]">
            O dia em que você começa a tratar sua{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              clínica
            </span>{" "}
            como{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              negócio
            </span>
            .
          </h1>

          <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-white/80 sm:text-base">
            Um dia presencial em Alphaville. Posicionamento, processo comercial,
            marketing e gestão — sem teoria, com aplicação prática.
          </p>

          <div className="mt-[22px] flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <CTAButton pulse>Garantir vaga · R$ 197</CTAButton>
          </div>

          <div className="mt-10 hidden flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-xs md:flex">
            <div className="flex items-center gap-2 text-white/85">
              <Calendar className="h-3.5 w-3.5 text-[var(--teal-light)]" strokeWidth={1.5} />
              <span className="font-medium tracking-wide">06 jun 2025</span>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-white/85">
              <Clock className="h-3.5 w-3.5 text-[var(--teal-light)]" strokeWidth={1.5} />
              <span className="font-medium tracking-wide">09h — 18h</span>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-white/85">
              <MapPin className="h-3.5 w-3.5 text-[var(--teal-light)]" strokeWidth={1.5} />
              <span className="font-medium tracking-wide">Alphaville · Barueri/SP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MarqueeBar({
  items,
  speed = "45s",
  reverse = false,
  fromColor = "#02070f",
  toColor = "#02070f",
}: {
  items: string[];
  speed?: string;
  reverse?: boolean;
  fromColor?: string;
  toColor?: string;
}) {
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div
      className="relative isolate overflow-hidden border-y border-white/10 py-5"
      style={{
        ["--marquee-duration" as string]: speed,
        background: `linear-gradient(180deg, ${fromColor} 0%, ${fromColor} 55%, ${toColor} 100%)`,
      }}
    >
      <div className="marquee-mask">
        <div
          className="marquee-track flex w-max items-center gap-10 lg:gap-14"
          style={reverse ? { animationDirection: "reverse" } : undefined}
        >
          {loop.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-10 whitespace-nowrap text-[0.7rem] font-medium uppercase tracking-[0.3em] text-white/60 lg:gap-14"
            >
              <span>{item}</span>
              <span className="text-[var(--teal-light)]/70">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MARQUEE_THEMES = [
  "Posicionamento digital",
  "Processo comercial",
  "Marketing estratégico",
  "Gestão financeira",
  "Mentalidade médico-empresário",
  "Estruturação de equipe",
  "06 jun · Alphaville · SP",
];

const MARQUEE_PROOF = [
  "+350 clínicas assessoradas",
  "R$ 1,4 bi em faturamento acumulado",
  "14 empresas fundadas",
  "+1.500 transplantes capilares",
  "+350 médicos formados",
  "Destaque em Veja · O Globo · IsToÉ",
];

const MARQUEE_EXPERIENCE = [
  "Imersão presencial",
  "4 a 6h de conteúdo direto",
  "Networking de alto nível",
  "Material de apoio exclusivo",
  "Coffee break",
  "Certificado Growth Day FPN Health",
  "Reembolso em 7 dias",
  "Pagamento seguro · Hubla",
];

function PainSection() {
  const pains = [
    "Você trabalha 12 horas por dia, mas no fim do mês a clínica não sobra dinheiro?",
    "Sua agenda só roda quando você está presente — sem você, tudo para?",
    "Os leads que chegam só perguntam preço e somem depois do orçamento?",
    "Você sente que sua autoridade técnica não está sendo traduzida em receita?",
  ];
  const headingRef = useScrollReveal<HTMLDivElement>();
  const listRef = useScrollReveal<HTMLDivElement>();
  return (
    <section className="bg-section-a relative isolate overflow-hidden py-28 lg:py-40">
      <div className="spotlight-tl absolute inset-0" aria-hidden="true" />
      <div className="bg-noise absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
        <div ref={headingRef} className="scroll-reveal max-w-3xl">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--teal-light)]">
            01 — Diagnóstico
          </span>
          <h2 className="mt-5 text-balance text-3xl font-light leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            Se você é médico, provavelmente já passou por{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              uma dessas situações
            </span>
            .
          </h2>
        </div>
        <div ref={listRef} className="scroll-reveal-stagger mt-16 divide-y divide-white/10 border-y border-white/10">
          {pains.map((p, i) => (
            <div
              key={i}
              className="group flex items-start gap-6 py-7 transition-colors sm:gap-10"
            >
              <span className="font-display text-2xl font-light italic text-[var(--teal-light)]/70 sm:text-3xl">
                0{i + 1}
              </span>
              <p className="text-base font-light leading-relaxed text-foreground/90 sm:text-lg">
                {p}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-14 max-w-2xl text-base font-light leading-relaxed text-foreground/70 sm:text-lg">
          O Growth Day existe para mudar isso —{" "}
          <span className="font-display italic text-foreground">em um único dia</span>.
        </p>
      </div>
    </section>
  );
}

function WhatIs() {
  const textRef = useScrollReveal<HTMLDivElement>();
  const statsRef = useScrollReveal<HTMLDivElement>();
  return (
    <section className="bg-section-b relative isolate overflow-hidden py-28 lg:py-40">
      <div className="spotlight-tr absolute inset-0" aria-hidden="true" />
      <div className="bg-noise absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-24">
          <div ref={textRef} className="scroll-reveal">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--teal-light)]">
              02 — O que é o Growth Day
            </span>
            <h2 className="mt-5 text-balance text-3xl font-light leading-[1.05] tracking-tight sm:text-4xl lg:text-[3.25rem]">
              O ponto de virada para o médico que quer construir{" "}
              <span className="font-display font-medium italic text-[var(--teal-light)]">
                um negócio sólido
              </span>
              .
            </h2>
            <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-foreground/75 sm:text-lg">
              Um dia presencial em Alphaville, com 4 a 6 horas de conteúdo direto ao
              ponto, conduzido por mentores que já construíram clínicas e empresas de 9
              dígitos. Sem teoria genérica. Sem promessa fácil. Aplicação prática para
              você sair com clareza do que precisa fazer na segunda-feira.
            </p>
            <div className="mt-10 flex justify-start">
              <CTAButton>Garantir minha vaga</CTAButton>
            </div>
          </div>
          <div ref={statsRef} className="scroll-reveal-stagger grid grid-cols-2 border border-white/10">
            {[
              { n: "1", l: "dia presencial" },
              { n: "4—6h", l: "de conteúdo" },
              { n: "5+", l: "palestrantes" },
              { n: "R$ 197", l: "ingresso único" },
            ].map((s, i) => (
              <div
                key={s.l}
                className={`px-6 py-10 text-center ${
                  i % 2 === 0 ? "border-r border-white/10" : ""
                } ${i < 2 ? "border-b border-white/10" : ""}`}
              >
                <div className="font-display text-4xl font-light text-foreground sm:text-5xl">
                  {s.n}
                </div>
                <div className="mt-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-foreground/55">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Themes() {
  const themes = [
    {
      icon: Target,
      title: "Posicionamento digital",
      desc: "Como construir autoridade médica online sem virar influenciador.",
      detail:
        "Construa uma presença digital que reflete a sua autoridade técnica — sem virar entretenimento. Vamos mostrar como definir um nicho claro, comunicar valor para o paciente certo e criar uma marca pessoal que sustenta preço alto e atrai os casos que você realmente quer atender.",
    },
    {
      icon: TrendingUp,
      title: "Processo comercial",
      desc: "Converter pacientes sem depender de desconto nem improviso.",
      detail:
        "Um processo comercial bem desenhado triplica conversão sem aumentar o investimento em mídia. Você vai sair com um playbook de qualificação de lead, script de atendimento e gatilhos de fechamento — testado em mais de 350 clínicas atendidas.",
    },
    {
      icon: Megaphone,
      title: "Marketing estratégico",
      desc: "Tráfego pago e conteúdo que atraem o paciente certo.",
      detail:
        "Anúncios que selecionam pacientes de alto valor, conteúdo orgânico que reforça autoridade e CRM que recupera leads frios. Sem cair na armadilha do desconto: marketing como motor de previsibilidade, não de promessa.",
    },
    {
      icon: DollarSign,
      title: "Gestão financeira",
      desc: "Saber quanto sua clínica realmente lucra — e como escalar.",
      detail:
        "Indicadores que importam: CAC, LTV, ticket médio, margem por procedimento. Você vai aprender a separar o caixa do médico do caixa da clínica, definir pró-labore, reinvestimento e quando — e como — escalar sem perder margem.",
    },
    {
      icon: Brain,
      title: "Mentalidade médico-empresário",
      desc: "Sair do operacional e ocupar o lugar de dono do negócio.",
      detail:
        "A transição mental mais difícil: parar de pensar como o melhor profissional da clínica e começar a pensar como o dono. Decisões estratégicas, delegação real, e os erros mais comuns que mantêm o médico preso na operação por anos.",
    },
    {
      icon: Award,
      title: "Estruturação de equipe",
      desc: "Tornar a clínica independente da sua presença diária.",
      detail:
        "Recepção, gestores de tráfego, vendedoras, médicos associados. Como contratar, treinar e remunerar uma equipe que entrega resultado consistente, com processos claros e indicadores que você acompanha sem precisar estar lá todos os dias.",
    },
  ];
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const headRef = useScrollReveal<HTMLDivElement>();
  const listRef = useScrollReveal<HTMLDivElement>();
  return (
    <section className="bg-section-a relative isolate overflow-hidden py-28 lg:py-40">
      <div className="spotlight-tr absolute inset-0" aria-hidden="true" />
      <div className="bg-noise absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
        <div ref={headRef} className="scroll-reveal max-w-3xl">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--teal-light)]">
            03 — Temas
          </span>
          <h2 className="mt-5 text-balance text-3xl font-light leading-[1.05] tracking-tight sm:text-4xl lg:text-[3.25rem]">
            O que você vai aprender no{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              Growth Day
            </span>
            .
          </h2>
          <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-foreground/65 sm:text-lg">
            Clique em cada tema para ver o que será coberto.
          </p>
        </div>

        <div
          ref={listRef}
          className="scroll-reveal-stagger mt-14 divide-y divide-white/10 border-y border-white/10"
        >
          {themes.map((t, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={t.title}>
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="group flex w-full items-center gap-6 py-7 text-left transition-colors hover:text-[var(--teal-light)] sm:gap-8"
                >
                  <span className="font-display w-10 text-sm font-light italic text-[var(--teal-light)]/60">
                    0{i + 1}
                  </span>
                  <t.icon
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      isOpen ? "text-[var(--teal-light)]" : "text-foreground/70"
                    }`}
                    strokeWidth={1.5}
                  />
                  <span className="flex-1 text-lg font-light tracking-tight sm:text-xl">
                    {t.title}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[var(--teal-light)] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-7 pl-16 pr-10 sm:pl-[4.5rem]">
                      <p className="text-base font-light leading-relaxed text-foreground/75 sm:text-lg">
                        {t.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Speakers() {
  const speakers = [
    {
      name: "Evandro Guedes",
      role: "Empresário",
      bio: "14 empresas fundadas. R$ 1,4 bi em faturamento acumulado. Cases de fusão e venda aplicados ao mercado médico.",
      photo: mentorEvandro,
    },
    {
      name: "Dr. Tiago Simão",
      role: "Cirurgião Plástico · CRM 137.398",
      bio: "1º lugar no Título SBCP. Fellowships nos EUA, Turquia e Colômbia. Especialista em Lipo HD e Contorno Corporal.",
      photo: mentorTiago,
    },
    {
      name: "Dr. Marcelo Nogueira",
      role: "Transplante Capilar · CRM SP 202.888",
      bio: "Criador do Método DVN. +1.500 transplantes, +350 médicos formados. Destaque em Veja, O Globo e IsToÉ.",
      photo: mentorMarcelo,
    },
    {
      name: "Felipe Muzitano",
      role: "CEO Side Growth · Marketing e Vendas",
      bio: "+350 clínicas assessoradas. Especialista em processo comercial e marketing digital para o mercado médico.",
      photo: mentorFelipe,
    },
  ];
  const loop = [...speakers, ...speakers];
  const headRef = useScrollReveal<HTMLDivElement>();
  return (
    <section className="bg-section-b relative isolate overflow-hidden py-28 lg:py-40">
      <div className="spotlight-bl absolute inset-0" aria-hidden="true" />
      <div className="bg-noise absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <div ref={headRef} className="scroll-reveal max-w-3xl">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--teal-light)]">
            04 — Mentores
          </span>
          <h2 className="mt-5 text-balance text-3xl font-light leading-[1.05] tracking-tight sm:text-4xl lg:text-[3.25rem]">
            Mentores que{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              construíram
            </span>{" "}
            o que ensinam.
          </h2>
        </div>
      </div>

      <div
        className="marquee-mask marquee-pause relative mt-16 overflow-hidden"
        style={{ ["--marquee-duration" as string]: "55s" }}
      >
        <div className="marquee-track flex w-max gap-6 px-6 lg:gap-8 lg:px-10">
          {loop.map((s, i) => (
            <article
              key={`${s.name}-${i}`}
              className="group w-[280px] shrink-0 sm:w-[340px] lg:w-[380px]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-card ring-1 ring-white/10 transition-all duration-500 group-hover:ring-[var(--teal-light)]/60">
                <img
                  src={s.photo}
                  alt={s.name}
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 40%, rgba(9,27,58,0.92) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="flex items-center gap-2.5">
                    <span className="h-px w-6 bg-[var(--teal-light)]" />
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[var(--teal-light)]">
                      Palestrante
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-light leading-tight tracking-tight text-white sm:text-2xl">
                    {s.name}
                  </h3>
                  <div className="mt-1 text-[0.7rem] font-medium tracking-wide text-white/65">
                    {s.role}
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm font-light leading-relaxed text-foreground/70">
                {s.bio}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl px-6 lg:px-10">
        <div className="flex items-center justify-center gap-4 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-foreground/60">
          <span className="h-px w-12 bg-white/15" />
          + Convidados especiais a confirmar
          <span className="h-px w-12 bg-white/15" />
        </div>

        <div className="mt-12 flex justify-center">
          <CTAButton>Quero estar presente · R$ 197</CTAButton>
        </div>
      </div>
    </section>
  );
}

function Offer() {
  const includes = [
    "1 dia completo de imersão presencial em Alphaville",
    "4 a 6 horas de conteúdo com 4+ palestrantes",
    "Material de apoio digital exclusivo do evento",
    "Networking com médicos e empresários de alto nível",
    "Coffee breaks ao longo do dia",
    "Certificado de participação Growth Day FPN Health",
  ];
  const cardRef = useScrollReveal<HTMLDivElement>();
  return (
    <section className="bg-section-a relative isolate overflow-hidden py-28 lg:py-40">
      <div className="spotlight-center absolute inset-0" aria-hidden="true" />
      <div className="bg-noise absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
        <div className="mb-12 max-w-3xl">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--teal-light)]">
            05 — Sua vaga
          </span>
          <h2 className="mt-5 text-balance text-3xl font-light leading-[1.05] tracking-tight sm:text-4xl lg:text-[3.25rem]">
            Um ingresso.{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              Um dia que muda o jogo
            </span>
            .
          </h2>
        </div>
        <div
          ref={cardRef}
          className="scroll-reveal relative overflow-hidden border border-white/15 bg-[#091b3a]"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--teal-light)] to-transparent" />

          <div className="grid lg:grid-cols-[1fr_1.2fr]">
            <div className="border-b border-white/10 p-10 lg:border-b-0 lg:border-r lg:p-14">
              <div className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[var(--teal-light)]">
                Oferta de lançamento
              </div>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-7xl font-light leading-none text-foreground sm:text-8xl">
                  197
                </span>
                <span className="text-2xl font-light text-foreground/70">R$</span>
              </div>
              <div className="mt-3 text-sm text-foreground/55">
                <span className="line-through opacity-70">De R$ 297,00</span>
                <span className="mx-2 opacity-40">·</span>
                à vista ou parcelado
              </div>

              <div className="mt-10 flex flex-col items-start gap-3">
                <CTAButton pulse>Garantir ingresso</CTAButton>
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/50">
                  Pagamento seguro · Hubla
                </p>
              </div>
            </div>

            <div className="p-10 lg:p-14">
              <div className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-foreground/55">
                Tudo incluso
              </div>
              <ul className="mt-6 space-y-4">
                {includes.map((i) => (
                  <li key={i} className="flex items-start gap-4 text-sm font-light leading-relaxed text-foreground/85 sm:text-base">
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-[var(--teal-light)]"
                      strokeWidth={2}
                    />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Logistics() {
  const headRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();
  return (
    <section className="bg-section-b relative isolate overflow-hidden py-28 lg:py-40">
      <div className="spotlight-tl absolute inset-0" aria-hidden="true" />
      <div className="bg-noise absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
        <div ref={headRef} className="scroll-reveal max-w-3xl">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--teal-light)]">
            06 — Logística
          </span>
          <h2 className="mt-5 text-balance text-3xl font-light leading-[1.05] tracking-tight sm:text-4xl lg:text-[3.25rem]">
            Onde e{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              quando
            </span>{" "}
            acontece.
          </h2>
        </div>

        <div ref={gridRef} className="scroll-reveal-stagger mt-16 grid border-t border-white/10 sm:grid-cols-3">
          {[
            { i: Calendar, t: "Data", v: "06 jun 2025", s: "Sexta-feira" },
            { i: Clock, t: "Horário", v: "09h — 18h", s: "Credenciamento 08h30" },
            {
              i: MapPin,
              t: "Local",
              v: "Alphaville",
              s: "Barueri/SP · endereço enviado por e-mail",
            },
          ].map((b, i) => (
            <div
              key={b.t}
              className={`border-b border-white/10 px-2 py-10 sm:px-6 lg:px-8 ${
                i < 2 ? "sm:border-r" : ""
              }`}
            >
              <b.i className="h-5 w-5 text-[var(--teal-light)]" strokeWidth={1.5} />
              <div className="mt-5 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-foreground/50">
                {b.t}
              </div>
              <div className="mt-2 font-display text-2xl font-light tracking-tight">
                {b.v}
              </div>
              <div className="mt-2 text-xs font-light leading-relaxed text-foreground/60">
                {b.s}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "Para quem é o Growth Day?",
      a: "Médicos que têm ou querem montar clínica própria — independente da especialidade. Cirurgiões plásticos, dermatologistas estéticos e médicos de qualquer área que queiram estruturar a clínica como negócio.",
    },
    {
      q: "Qual a diferença entre o Growth Day e a Imersão FPN Health?",
      a: "O Growth Day é uma introdução prática de 1 dia aos principais temas. A Imersão FPN Health, em julho, é o aprofundamento completo, com plano de ação, diagnóstico e playbook personalizado.",
    },
    {
      q: "Como funciona o pagamento?",
      a: "Pelo Hubla — plataforma 100% segura. Você pode pagar à vista no Pix/cartão ou parcelar no cartão de crédito.",
    },
    {
      q: "Posso pedir reembolso?",
      a: "Sim. Garantimos reembolso integral em até 7 dias após a compra, conforme o Código de Defesa do Consumidor.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  const headRef = useScrollReveal<HTMLDivElement>();
  const listRef = useScrollReveal<HTMLDivElement>();
  return (
    <section className="bg-section-a relative isolate overflow-hidden py-28 lg:py-40">
      <div className="spotlight-br absolute inset-0" aria-hidden="true" />
      <div className="bg-noise absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
        <div ref={headRef} className="scroll-reveal max-w-3xl">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--teal-light)]">
            07 — Perguntas
          </span>
          <h2 className="mt-5 text-balance text-3xl font-light leading-[1.05] tracking-tight sm:text-4xl lg:text-[3.25rem]">
            Ainda em{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              dúvida
            </span>
            ?
          </h2>
        </div>

        <div ref={listRef} className="scroll-reveal-stagger mt-14 divide-y divide-white/10 border-y border-white/10">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-7 text-left transition-colors"
                >
                  <span className="text-lg font-light tracking-tight text-foreground sm:text-xl">
                    {it.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[var(--teal-light)] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-7 pr-10 text-base font-light leading-relaxed text-foreground/70 sm:text-lg">
                      {it.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const contentRef = useScrollReveal<HTMLDivElement>();
  const cardRef = useScrollReveal<HTMLDivElement>();
  return (
    <section
      className="relative isolate overflow-hidden py-32 lg:py-44"
      style={{
        background:
          "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(26, 123, 175, 0.12), transparent 65%), linear-gradient(180deg, #02070f 0%, #050f22 50%, #02070f 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(75,175,214,0.5) 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div
        ref={contentRef}
        className="scroll-reveal relative mx-auto max-w-5xl px-6 lg:px-10"
      >
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--teal-light)]">
            08 — Última chamada
          </span>

          <div className="mt-6 inline-flex items-center gap-3 border border-white/20 bg-white/[0.03] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/85 backdrop-blur-sm">
            <span className="dot-pulse h-1 w-1 rounded-full bg-[var(--teal-light)]" />
            Últimas vagas
          </div>

          <h2 className="mt-8 text-balance text-4xl font-light leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[4.25rem]">
            Em 06 de junho, sua clínica pode começar a operar como{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              um negócio de verdade
            </span>
            .
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-base font-light leading-relaxed text-white/70 sm:text-lg">
            Não deixe para o próximo evento. As vagas presenciais são limitadas
            pelo espaço físico em Alphaville.
          </p>
        </div>

        <div
          ref={cardRef}
          className="scroll-reveal-stagger mx-auto mt-16 grid max-w-3xl grid-cols-1 border border-white/10 bg-white/[0.02] backdrop-blur-sm sm:grid-cols-3"
        >
          <div className="border-b border-white/10 px-6 py-8 text-center sm:border-b-0 sm:border-r">
            <Calendar
              className="mx-auto h-5 w-5 text-[var(--teal-light)]"
              strokeWidth={1.5}
            />
            <div className="mt-4 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-white/45">
              Data
            </div>
            <div className="mt-1 font-display text-lg font-light tracking-tight text-white">
              06 jun 2025
            </div>
          </div>
          <div className="border-b border-white/10 px-6 py-8 text-center sm:border-b-0 sm:border-r">
            <MapPin
              className="mx-auto h-5 w-5 text-[var(--teal-light)]"
              strokeWidth={1.5}
            />
            <div className="mt-4 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-white/45">
              Local
            </div>
            <div className="mt-1 font-display text-lg font-light tracking-tight text-white">
              Alphaville · SP
            </div>
          </div>
          <div className="px-6 py-8 text-center">
            <DollarSign
              className="mx-auto h-5 w-5 text-[var(--teal-light)]"
              strokeWidth={1.5}
            />
            <div className="mt-4 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-white/45">
              Investimento
            </div>
            <div className="mt-1 font-display text-lg font-light tracking-tight text-white">
              R$ 197
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4">
          <CTAButton pulse>Quero minha vaga · R$ 197</CTAButton>
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/50">
            Pagamento via Hubla · Reembolso em 7 dias
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-section-a border-t border-white/10 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center lg:px-10">
        <img src={fpnLogo} alt="FPN Health" className="h-14 w-auto sm:h-16" />
        <p className="text-[0.7rem] uppercase tracking-[0.25em] text-foreground/55">
          Growth Day 2025 · 06 jun · Alphaville · Barueri/SP
        </p>
        <p className="mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-foreground/35">
          © {new Date().getFullYear()} FPN Health — Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}

function GrowthDayLanding() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <LeadModalContext.Provider value={{ open: () => setModalOpen(true) }}>
      <main className="min-h-screen bg-background text-foreground">
        <UrgencyBar />
        <Hero />
        <MarqueeBar items={MARQUEE_THEMES} />
        <PainSection />
        <WhatIs />
        <MarqueeBar
          items={MARQUEE_PROOF}
          speed="55s"
          reverse
          fromColor="#04122a"
          toColor="#02070f"
        />
        <Themes />
        <Speakers />
        <MarqueeBar
          items={MARQUEE_EXPERIENCE}
          speed="40s"
          fromColor="#04122a"
          toColor="#02070f"
        />
        <Offer />
        <Logistics />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
      <LeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </LeadModalContext.Provider>
  );
}

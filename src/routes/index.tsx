import { createFileRoute } from "@tanstack/react-router";
import { useState, createContext, useContext, useEffect } from "react";
import heroBg from "@/assets/bg.png";
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
  Check,
  ChevronDown,
  Target,
  TrendingUp,
  Megaphone,
  DollarSign,
  Brain,
  X,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Growth Day FPN Health · 06 de junho · Alphaville/SP" },
      {
        name: "description",
        content:
          "1 dia para começar a tratar sua clínica como negócio. Posicionamento, processo comercial, marketing e gestão para médicos. Vagas limitadas por R$ 197.",
      },
      { property: "og:title", content: "Growth Day FPN Health · 06/06/2026" },
      {
        property: "og:description",
        content:
          "Evento presencial em Alphaville. Para médicos que querem parar de trabalhar muito e lucrar pouco.",
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

// Chaves conhecidas — garantidas no payload (vazias se ausentes) para schema estável no CRM.
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
] as const;
const ALL_PARAMS_STORAGE_KEY = "growthday_all_params";
const LEGACY_UTM_STORAGE_KEY = "growthday_utms";

// Captura TODOS os parâmetros da URL (não apenas UTMs) e persiste na sessão.
// Atribuição de primeiro toque: valores capturados não são sobrescritos em recargas.
function captureUTMParams(): Record<string, string> {
  if (typeof window === "undefined") {
    const empty: Record<string, string> = {};
    for (const key of UTM_KEYS) empty[key] = "";
    return empty;
  }

  let stored: Record<string, string> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(ALL_PARAMS_STORAGE_KEY) || "{}");
  } catch {
    stored = {};
  }
  // Compatibilidade com versão anterior que só guardava UTMs
  try {
    const legacy = JSON.parse(sessionStorage.getItem(LEGACY_UTM_STORAGE_KEY) || "{}");
    for (const [k, v] of Object.entries(legacy)) {
      if (typeof v === "string" && v && !stored[k]) stored[k] = v;
    }
  } catch {
    /* ignore */
  }

  // Mescla com a URL atual — primeiro toque vence
  const params = new URLSearchParams(window.location.search);
  let updated = false;
  params.forEach((value, key) => {
    if (value && !stored[key]) {
      stored[key] = value;
      updated = true;
    }
  });

  if (updated) {
    try {
      sessionStorage.setItem(ALL_PARAMS_STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* sessionStorage indisponível */
    }
  }

  // Garante presença de todas as chaves UTM conhecidas (mesmo vazias)
  const result: Record<string, string> = { ...stored };
  for (const key of UTM_KEYS) {
    if (!(key in result)) result[key] = "";
  }
  return result;
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
        size === "lg" ? "px-7 py-3.5 text-[0.7rem] sm:text-xs" : "px-6 py-3 text-[0.7rem]"
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
    const utms = captureUTMParams();
    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      source: "growth-day-landing",
      event: "Growth Day FPN Health",
      fb_access_token: FB_TOKEN,
      submitted_at: new Date().toISOString(),
      ...utms,
      landing_url: window.location.href,
    };
    try {
      window.fbq?.("track", "Lead", { content_name: "Growth Day FPN Health" });
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify(payload),
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
      {/* Mobile: foto dos mentores como fundo full-bleed */}
      <div
        className="absolute inset-0 bg-top bg-cover bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${heroBgMobile})` }}
        aria-hidden="true"
      />
      {/* Desktop: foto dos mentores como fundo full-bleed */}
      <div
        className="absolute inset-0 hidden bg-center bg-cover bg-no-repeat md:block"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />

      {/* Mobile: scrim escuro atrás do texto (topo) que dissolve sobre os palestrantes */}
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,24,47,0.95) 0%, rgba(7,24,47,0.88) 20%, rgba(7,24,47,0.5) 36%, rgba(7,24,47,0.08) 50%, transparent 62%)",
        }}
        aria-hidden="true"
      />

      {/* Degradê inferior para transição suave */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 lg:h-56"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(2,7,15,0.35) 45%, rgba(2,7,15,0.85) 80%, #02070f 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pt-10 lg:px-8 lg:pt-16">
        <div className="max-w-xl">
          <div className="mb-4 inline-flex items-center gap-3 border border-white/25 bg-white/[0.04] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm">
            <span className="dot-pulse h-1 w-1 rounded-full bg-[var(--teal-light)]" />
            06 jun · Alphaville · SP
          </div>

          <h1 className="text-balance text-[1.7rem] font-light leading-[1.08] tracking-[-0.02em] text-white sm:text-[1.9rem] lg:text-[2.4rem] xl:text-[2.7rem]">
            Em 1 dia, você aprende como parar de ser o{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              gargalo
            </span>{" "}
            da sua clínica e começa a tratá-la como um{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              negócio real
            </span>
            .
          </h1>

          <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-white/80 sm:mt-6 sm:text-base">
            Você foi formado para ser um excelente médico. Ninguém te ensinou a
            gerir, vender e crescer uma clínica. O Growth Day existe para corrigir
            isso em um único dia intenso, com quem já fez.
          </p>

          <div className="mt-2 flex flex-col items-start gap-4 sm:mt-4 sm:flex-row sm:items-center">
            <CTAButton pulse>Garantir vaga · R$ 197</CTAButton>
          </div>

          <div className="mt-10 hidden flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-xs md:flex">
            <div className="flex items-center gap-2 text-white/85">
              <Calendar className="h-3.5 w-3.5 text-[var(--teal-light)]" strokeWidth={1.5} />
              <span className="font-medium tracking-wide">06 jun 2026</span>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-white/85">
              <Clock className="h-3.5 w-3.5 text-[var(--teal-light)]" strokeWidth={1.5} />
              <span className="font-medium tracking-wide">17h às 22h</span>
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
    "Você fatura bem no papel, mas o caixa nunca aparece?",
    "Seus leads só perguntam preço e somem depois do orçamento?",
    "Você é bom médico, mas não sabe como crescer sem trabalhar mais horas?",
    "Sua clínica para quando você para?",
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
            01 · Diagnóstico
          </span>
          <h2 className="mt-3 text-balance text-xl font-light leading-[1.15] tracking-tight sm:text-2xl lg:text-[2.3rem]">
            Se você se identifica com alguma{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              dessas situações
            </span>
            , o Growth Day foi feito para você.
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
        <div className="mt-14 max-w-2xl space-y-5 text-base font-light leading-relaxed text-foreground/70 sm:text-lg">
          <p>
            Esses não são problemas de esforço.{" "}
            <span className="font-display italic text-foreground">São problemas de modelo.</span>
          </p>
          <p>
            Um médico sobrecarregado que não tem processo comercial,
            posicionamento e gestão financeira pode triplicar o faturamento e
            ainda assim não construir patrimônio. É exatamente esse ciclo que
            vamos quebrar no Growth Day.
          </p>
        </div>
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
              02 · O que é o Growth Day
            </span>
            <h2 className="mt-3 text-balance text-xl font-light leading-[1.15] tracking-tight sm:text-2xl lg:text-[2.3rem]">
              O dia em que a sua clínica começa a tratar você como{" "}
              <span className="font-display font-medium italic text-[var(--teal-light)]">
                sócio
              </span>
              , não como funcionário.
            </h2>
            <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-foreground/75 sm:text-lg">
              O Growth Day é um evento presencial de um dia promovido pela FPN
              Health, em Alphaville. São 4 a 6 horas de conteúdo direto ao ponto,
              com especialistas que já construíram e ainda constroem negócios
              reais dentro do mercado médico.
            </p>
            <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-foreground/75 sm:text-lg">
              Não é mais uma palestra teórica. É uma jornada estruturada para
              que você saia com clareza sobre o que está travando sua clínica e
              qual é o próximo passo concreto para mudar isso.
            </p>
            <div className="mt-10 flex justify-start">
              <CTAButton>Garantir minha vaga</CTAButton>
            </div>
          </div>
          <div ref={statsRef} className="scroll-reveal-stagger grid grid-cols-2 border border-white/10">
            {[
              { n: "1", l: "dia presencial" },
              { n: "4 a 6h", l: "de conteúdo" },
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
      title: "Posicionamento digital e autoridade médica nas redes",
      desc: "Como construir autoridade médica online sem virar influenciador.",
      detail:
        "Construa uma presença digital que reflete a sua autoridade técnica, sem virar entretenimento. Vamos mostrar como definir um nicho claro, comunicar valor para o paciente certo e criar uma marca pessoal que sustenta preço alto e atrai os casos que você realmente quer atender.",
    },
    {
      icon: TrendingUp,
      title: "Processo comercial: converter sem depender de desconto",
      desc: "Como transformar orçamento em paciente fechado, com previsibilidade.",
      detail:
        "Um processo comercial bem desenhado triplica conversão sem aumentar o investimento em mídia. Você vai sair com um playbook de qualificação de lead, script de atendimento e gatilhos de fechamento, testado em mais de 350 clínicas atendidas.",
    },
    {
      icon: Megaphone,
      title: "Marketing estratégico para médicos",
      desc: "O que realmente funciona em 2026.",
      detail:
        "Anúncios que selecionam pacientes de alto valor, conteúdo orgânico que reforça autoridade e CRM que recupera leads frios. Sem cair na armadilha do desconto: marketing como motor de previsibilidade, não de promessa.",
    },
    {
      icon: DollarSign,
      title: "Gestão financeira básica",
      desc: "Sair do ciclo de faturar muito e guardar pouco.",
      detail:
        "Indicadores que importam: CAC, LTV, ticket médio, margem por procedimento. Você vai aprender a separar o caixa do médico do caixa da clínica, definir pró-labore, reinvestimento e como escalar sem perder margem.",
    },
    {
      icon: Brain,
      title: "Mentalidade de médico-empresário",
      desc: "Os fundamentos de quem escala uma clínica.",
      detail:
        "A transição mental mais difícil: parar de pensar como o melhor profissional da clínica e começar a pensar como o dono. Decisões estratégicas, delegação real e os erros mais comuns que mantêm o médico preso na operação por anos.",
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
            03 · Temas
          </span>
          <h2 className="mt-3 text-balance text-xl font-light leading-[1.15] tracking-tight sm:text-2xl lg:text-[2.3rem]">
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

        <div className="mt-14 border border-white/10 bg-white/[0.02] p-7 sm:p-9">
          <div className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[var(--teal-light)]">
            Atenção
          </div>
          <p className="mt-4 text-base font-light leading-relaxed text-foreground/75 sm:text-lg">
            O Growth Day cobre esses temas em formato introdutório e
            estratégico. O aprofundamento completo, com diagnóstico individual,
            plano de ação e playbook, acontece na Imersão FPN Health nos dias
            10 e 11 de julho. Os dois eventos são complementares, não
            concorrentes.
          </p>
        </div>
      </div>
    </section>
  );
}

function Speakers() {
  const speakers = [
    {
      name: "Evandro Guedes",
      role: "Empresário · Fundador de 14 empresas",
      bio: "R$ 1,4 bilhão em faturamento acumulado. Construiu e vendeu múltiplos negócios ao longo de 20 anos. Mostra que uma clínica médica é um negócio como qualquer outro e pode ser escalado como tal.",
      photo: mentorEvandro,
    },
    {
      name: "Dr. Tiago Simão",
      role: "Cirurgião Plástico · CRM 137.398 · RQE 54367",
      bio: "1º lugar no concurso nacional de Título de Especialista da SBCP. Membro Pleno da SBCP. Fellowships nos EUA, Turquia e Colômbia. Especialista em Lipoaspiração HD e Contorno Corporal.",
      photo: mentorTiago,
    },
    {
      name: "Dr. Marcelo Nogueira",
      role: "Transplante Capilar · CRM SP 202.888",
      bio: "Criador do Método DVN, técnica exclusiva no Brasil. Mais de 1.500 transplantes realizados. Formou mais de 350 médicos. Destaque em Veja, O Globo e IsToÉ.",
      photo: mentorMarcelo,
    },
    {
      name: "Felipe Muzitano",
      role: "CEO Side Growth · Marketing e Vendas",
      bio: "Mais de 350 clínicas assessoradas. Traduz estratégias de empresas de alto crescimento para a realidade do consultório médico, sem jargão e sem atalho.",
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
            04 · Palestrantes
          </span>
          <h2 className="mt-3 text-balance text-xl font-light leading-[1.15] tracking-tight sm:text-2xl lg:text-[2.3rem]">
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
    "Acesso a 1 dia completo de conteúdo",
    "Múltiplos palestrantes especializados",
    "Material de apoio impresso",
    "Coffee break e networking exclusivo",
    "Certificado de participação",
  ];
  const cardRef = useScrollReveal<HTMLDivElement>();
  return (
    <section className="bg-section-a relative isolate overflow-hidden py-28 lg:py-40">
      <div className="spotlight-center absolute inset-0" aria-hidden="true" />
      <div className="bg-noise absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
        <div className="mb-12 max-w-3xl">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--teal-light)]">
            05 · Sua vaga
          </span>
          <h2 className="mt-3 text-balance text-xl font-light leading-[1.15] tracking-tight sm:text-2xl lg:text-[2.3rem]">
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
            06 · Logística
          </span>
          <h2 className="mt-3 text-balance text-xl font-light leading-[1.15] tracking-tight sm:text-2xl lg:text-[2.3rem]">
            Onde e{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              quando
            </span>{" "}
            acontece.
          </h2>
        </div>

        <div ref={gridRef} className="scroll-reveal-stagger mt-16 grid border-t border-white/10 sm:grid-cols-3">
          {[
            { i: Calendar, t: "Data", v: "06 jun 2026", s: "Sábado" },
            { i: Clock, t: "Horário", v: "17h às 22h", s: "Credenciamento a partir das 17h" },
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
      q: "O Growth Day é para médicos de qual especialidade?",
      a: "Para qualquer médico que tem ou quer ter clínica própria. O conteúdo é especialmente relevante para quem atua com estética avançada, cirurgia plástica, transplante capilar e harmonização facial. Os princípios se aplicam a qualquer especialidade.",
    },
    {
      q: "O Growth Day é diferente da Imersão de julho?",
      a: "Sim. O Growth Day aborda os fundamentos em um dia, com múltiplos palestrantes e visão estratégica. A Imersão FPN Health (10 e 11 de julho) é o aprofundamento completo: diagnóstico individual da sua clínica, plano de ação personalizado e playbook para os próximos 12 meses. Os dois eventos são complementares e não substituem um ao outro.",
    },
    {
      q: "E se eu não puder comparecer depois de comprar?",
      a: "Consulte a política de cancelamento e transferência no momento da compra, disponível na plataforma Hubla. Em caso de dúvidas, entre em contato diretamente com nossa equipe pelo WhatsApp.",
    },
    {
      q: "Por que o ingresso está com desconto?",
      a: "Este é o lote de lançamento, disponível por tempo limitado enquanto houver vagas. Assim que esgotar, o valor retorna a R$ 297, e o evento pode lotar antes disso. Garantir agora é a decisão mais econômica.",
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
            07 · Perguntas
          </span>
          <h2 className="mt-3 text-balance text-xl font-light leading-[1.15] tracking-tight sm:text-2xl lg:text-[2.3rem]">
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
            08 · Última chamada
          </span>

          <div className="mt-6 inline-flex items-center gap-3 border border-white/20 bg-white/[0.03] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/85 backdrop-blur-sm">
            <span className="dot-pulse h-1 w-1 rounded-full bg-[var(--teal-light)]" />
            Últimas vagas
          </div>

          <h2 className="mt-6 text-balance text-2xl font-light leading-[1.1] tracking-tight text-white sm:text-3xl lg:text-[2.9rem]">
            O custo de não ir não é R$ 197.{" "}
            <span className="font-display font-medium italic text-[var(--teal-light)]">
              É mais um semestre tratando sua clínica como hobby.
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-base font-light leading-relaxed text-white/70 sm:text-lg">
            06 de junho de 2026 · Alphaville, Barueri/SP. Vagas limitadas.
            Quando esgotar, não haverá lista de espera.
          </p>

          <div className="mx-auto mt-10 max-w-xl space-y-3 border-l-2 border-[var(--teal-light)]/60 pl-5 text-left text-base font-light leading-relaxed text-white/80 sm:text-lg">
            <p>
              O médico que vai ao Growth Day em junho chega à Imersão de julho
              com vantagem.
            </p>
            <p>
              O médico que fica em casa segue exatamente onde estava.
            </p>
          </div>
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
              06 jun 2026
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
        <p className="text-[0.7rem] uppercase tracking-[0.25em] text-foreground/55">
          Growth Day 2026 · 06 jun · Alphaville · Barueri/SP
        </p>
        <p className="mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-foreground/35">
          © {new Date().getFullYear()} FPN Health · Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}

function GrowthDayLanding() {
  const [modalOpen, setModalOpen] = useState(false);
  // Captura as UTMs logo no carregamento, antes de qualquer navegação interna.
  useEffect(() => {
    captureUTMParams();
  }, []);
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

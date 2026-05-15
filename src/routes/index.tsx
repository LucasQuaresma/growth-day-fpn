import { createFileRoute } from "@tanstack/react-router";
import { useState, createContext, useContext } from "react";
import heroStage from "@/assets/hero-stage.jpg";
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
}: {
  children?: React.ReactNode;
  size?: "lg" | "md";
}) {
  const { open } = useContext(LeadModalContext);
  return (
    <button
      type="button"
      onClick={open}
      className={`mx-auto inline-flex w-full max-w-sm items-center justify-center rounded-md font-bold uppercase tracking-wide text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] sm:w-auto ${
        size === "lg" ? "px-8 py-4 text-base sm:text-lg" : "px-6 py-3 text-sm"
      }`}
      style={{ background: "var(--gradient-cta)" }}
    >
      {children}
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
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-balance text-2xl font-black leading-tight">
          Garanta sua vaga no <span className="text-[var(--teal-light)]">Growth Day</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Preencha seus dados para continuar para o checkout seguro do Hubla.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="lead-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Nome completo
            </label>
            <input
              id="lead-name"
              type="text"
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-[var(--teal)]"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label htmlFor="lead-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              E-mail
            </label>
            <input
              id="lead-email"
              type="email"
              required
              maxLength={200}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-[var(--teal)]"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label htmlFor="lead-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              WhatsApp / Telefone
            </label>
            <input
              id="lead-phone"
              type="tel"
              required
              maxLength={30}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-[var(--teal)]"
              placeholder="(11) 99999-9999"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-4 text-base font-bold uppercase tracking-wide text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] disabled:opacity-70"
            style={{ background: "var(--gradient-cta)" }}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
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
    <div className="sticky top-0 z-50 border-b border-border bg-[var(--navy-deep)] py-2.5 text-center text-xs sm:text-sm">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 font-medium text-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-[var(--teal-light)]" /> 06 DE JUNHO
        </span>
        <span className="hidden sm:inline text-muted-foreground">|</span>
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[var(--teal-light)]" /> ALPHAVILLE — BARUERI/SP
        </span>
        <span className="hidden sm:inline text-muted-foreground">|</span>
        <span className="flex items-center gap-1.5 text-[var(--teal-light)]">
          <Users className="h-3.5 w-3.5" /> VAGAS LIMITADAS
        </span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroStage}
          alt="Palco do evento Growth Day"
          width={1600}
          height={1000}
          className="h-full w-full object-cover opacity-30"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.18 0.07 260 / 0.7) 0%, oklch(0.22 0.08 260 / 0.95) 80%, var(--navy)) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-16 sm:pt-24 lg:pb-28 lg:pt-32 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--teal)] bg-[var(--teal)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--teal-light)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal-light)] animate-pulse" />
          Growth Day FPN Health · 2025
        </div>

        <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          O dia em que você começa a tratar sua{" "}
          <span className="text-[var(--teal-light)]">clínica como negócio</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          1 dia presencial em Alphaville. Posicionamento, processo comercial, marketing
          e gestão — sem teoria, com aplicação prática para médicos que querem parar de
          trabalhar muito e lucrar pouco.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <CTAButton>Quero garantir minha vaga · R$ 197</CTAButton>
          <p className="text-xs text-muted-foreground">
            <span className="line-through opacity-60">De R$ 297</span> · por R$ 197 ·
            pagamento via Hubla
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-3 border-t border-border pt-6 text-xs sm:text-sm">
          <div className="flex flex-col items-center gap-1">
            <Calendar className="h-5 w-5 text-[var(--teal-light)]" />
            <span className="font-bold">06 jun 2025</span>
            <span className="text-muted-foreground">Sexta-feira</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Clock className="h-5 w-5 text-[var(--teal-light)]" />
            <span className="font-bold">09h às 18h</span>
            <span className="text-muted-foreground">4 a 6h conteúdo</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <MapPin className="h-5 w-5 text-[var(--teal-light)]" />
            <span className="font-bold">Alphaville</span>
            <span className="text-muted-foreground">Barueri/SP</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PainSection() {
  const pains = [
    "Você trabalha 12 horas por dia, mas no fim do mês a clínica não sobra dinheiro?",
    "Sua agenda só roda quando você está presente — sem você, tudo para?",
    "Os leads que chegam só perguntam preço e somem depois do orçamento?",
    "Você sente que sua autoridade técnica não está sendo traduzida em receita?",
  ];
  return (
    <section className="bg-[var(--navy-deep)] py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-balance text-center text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
          Se você é médico, provavelmente já passou por{" "}
          <span className="text-[var(--teal-light)]">uma dessas situações</span>
        </h2>
        <div className="mt-12 space-y-4">
          {pains.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-[var(--teal)]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--teal)]/15 text-sm font-bold text-[var(--teal-light)]">
                {i + 1}
              </div>
              <p className="text-base text-foreground sm:text-lg">{p}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-base text-muted-foreground sm:text-lg">
          O Growth Day existe para mudar isso — em <strong className="text-foreground">um único dia</strong>.
        </p>
      </div>
    </section>
  );
}

function WhatIs() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--teal-light)]">
              O que é o Growth Day
            </span>
            <h2 className="mt-3 text-balance text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              O ponto de virada para o médico que quer construir um negócio sólido.
            </h2>
            <p className="mt-6 text-base text-muted-foreground sm:text-lg">
              Um dia presencial em Alphaville, com 4 a 6 horas de conteúdo direto ao
              ponto, conduzido por mentores que já construíram clínicas e empresas de 9
              dígitos. Sem teoria genérica. Sem promessa fácil. Aplicação prática para
              você sair com clareza do que precisa fazer na segunda-feira.
            </p>
            <div className="mt-8">
              <CTAButton>Garantir minha vaga</CTAButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: "1", l: "dia presencial" },
              { n: "4-6h", l: "de conteúdo" },
              { n: "5+", l: "palestrantes" },
              { n: "R$ 197", l: "ingresso único" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="text-3xl font-black text-[var(--teal-light)] sm:text-4xl">
                  {s.n}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
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
    },
    {
      icon: TrendingUp,
      title: "Processo comercial",
      desc: "Converter pacientes sem depender de desconto nem improviso.",
    },
    {
      icon: Megaphone,
      title: "Marketing estratégico",
      desc: "Tráfego pago e conteúdo que atraem o paciente certo.",
    },
    {
      icon: DollarSign,
      title: "Gestão financeira",
      desc: "Saber quanto sua clínica realmente lucra — e como escalar.",
    },
    {
      icon: Brain,
      title: "Mentalidade médico-empresário",
      desc: "Sair do operacional e ocupar o lugar de dono do negócio.",
    },
    {
      icon: Award,
      title: "Estruturação de equipe",
      desc: "Tornar a clínica independente da sua presença diária.",
    },
  ];
  return (
    <section className="bg-[var(--navy-deep)] py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--teal-light)]">
            Temas abordados
          </span>
          <h2 className="mt-3 text-balance text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            O que você vai aprender no Growth Day
          </h2>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((t) => (
            <div
              key={t.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-[var(--teal)]"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--teal)]/15 text-[var(--teal-light)]">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
            </div>
          ))}
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
      bio: "14 empresas fundadas. R$ 1,4 bilhão em faturamento acumulado. Cases de fusão e venda — agora aplicados ao mercado médico.",
      initials: "EG",
    },
    {
      name: "Dr. Tiago Simão",
      role: "Cirurgião Plástico · CRM 137.398 · RQE 54367",
      bio: "1º lugar no Título de Especialista SBCP. Membro Pleno da SBCP. Fellowships nos EUA, Turquia e Colômbia. Especialista em Lipo HD e Contorno Corporal.",
      initials: "TS",
    },
    {
      name: "Dr. Marcelo Nogueira",
      role: "Transplante Capilar · CRM SP 202888",
      bio: "Criador do Método DVN, técnica exclusiva no Brasil. +1.500 transplantes realizados, +350 médicos formados. Destaque em Veja, O Globo e IsToÉ.",
      initials: "MN",
    },
    {
      name: "Felipe Muzitano",
      role: "CEO Side Growth · Marketing e Vendas",
      bio: "Mais de 350 clínicas assessoradas. Especialista em processo comercial e marketing digital para o mercado médico.",
      initials: "FM",
    },
  ];
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--teal-light)]">
            Quem vai falar
          </span>
          <h2 className="mt-3 text-balance text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            Mentores que construíram o que ensinam
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {speakers.map((s) => (
            <div
              key={s.name}
              className="flex gap-5 rounded-xl border border-border bg-card p-6 transition-colors hover:border-[var(--teal)]"
            >
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-xl font-black text-primary-foreground"
                style={{ background: "var(--gradient-cta)" }}
              >
                {s.initials}
              </div>
              <div>
                <h3 className="text-lg font-bold">{s.name}</h3>
                <div className="text-xs font-medium text-[var(--teal-light)]">
                  {s.role}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-[var(--teal)] bg-[var(--teal)]/5 p-6 text-center">
          <p className="text-sm font-semibold text-[var(--teal-light)]">
            + Convidados especiais a confirmar
          </p>
        </div>

        <div className="mt-10 text-center">
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
  return (
    <section className="bg-[var(--navy-deep)] py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4">
        <div className="overflow-hidden rounded-2xl border border-[var(--teal)]/40 bg-card shadow-[var(--shadow-card)]">
          <div
            className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-primary-foreground"
            style={{ background: "var(--gradient-cta)" }}
          >
            Oferta de lançamento — vagas limitadas
          </div>

          <div className="p-8 sm:p-12">
            <h2 className="text-balance text-center text-3xl font-black leading-tight sm:text-4xl">
              Seu ingresso para o Growth Day
            </h2>

            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground line-through">
                De R$ 297,00
              </div>
              <div className="mt-1 text-5xl font-black text-foreground sm:text-6xl">
                R$ <span className="text-[var(--teal-light)]">197</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                pagamento único · à vista ou parcelado no Hubla
              </div>
            </div>

            <ul className="mt-8 space-y-3">
              {includes.map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--teal-light)]" />
                  <span className="text-sm sm:text-base">{i}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center gap-3">
              <CTAButton>Garantir meu ingresso agora</CTAButton>
              <p className="text-xs text-muted-foreground">
                Compra 100% segura via Hubla
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Logistics() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--teal-light)]">
            Local e logística
          </span>
          <h2 className="mt-3 text-balance text-3xl font-black sm:text-4xl">
            Onde e quando acontece
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { i: Calendar, t: "Data", v: "06 de junho de 2025", s: "Sexta-feira" },
            { i: Clock, t: "Horário", v: "09h às 18h", s: "Credenciamento 08h30" },
            {
              i: MapPin,
              t: "Endereço",
              v: "Alphaville — Barueri/SP",
              s: "Endereço completo enviado por e-mail após inscrição",
            },
          ].map((b) => (
            <div
              key={b.t}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <b.i className="mx-auto mb-3 h-7 w-7 text-[var(--teal-light)]" />
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {b.t}
              </div>
              <div className="mt-2 font-bold">{b.v}</div>
              <div className="mt-1 text-xs text-muted-foreground">{b.s}</div>
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
  return (
    <section className="bg-[var(--navy-deep)] py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--teal-light)]">
            Perguntas frequentes
          </span>
          <h2 className="mt-3 text-balance text-3xl font-black sm:text-4xl">
            Ainda em dúvida?
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {items.map((it, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left text-base font-bold transition-colors hover:bg-[var(--navy)]"
              >
                <span>{it.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[var(--teal-light)] transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="border-t border-border px-5 pb-5 pt-4 text-sm text-muted-foreground sm:text-base">
                  {it.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute inset-0 opacity-20">
        <img
          src={heroStage}
          alt=""
          width={1600}
          height={1000}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--teal-light)] bg-[var(--teal)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--teal-light)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal-light)] animate-pulse" />
          Últimas vagas
        </div>
        <h2 className="text-balance text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
          Em 06 de junho, sua clínica pode começar a operar como{" "}
          <span className="text-[var(--teal-light)]">um negócio de verdade</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          Não deixe para o próximo evento. As vagas presenciais são limitadas pelo
          espaço físico em Alphaville.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3">
          <CTAButton>Quero minha vaga · R$ 197</CTAButton>
          <p className="text-xs text-muted-foreground">
            Pagamento via Hubla · Reembolso garantido em 7 dias
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-[var(--navy-deep)] py-10">
      <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
        <div className="text-sm font-bold text-foreground">FPN Health</div>
        <p className="mt-2">
          Growth Day 2025 · 06 de junho · Alphaville — Barueri/SP
        </p>
        <p className="mt-3 opacity-70">
          © {new Date().getFullYear()} FPN Health. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

function GrowthDayLanding() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <UrgencyBar />
      <Hero />
      <PainSection />
      <WhatIs />
      <Themes />
      <Speakers />
      <Offer />
      <Logistics />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}

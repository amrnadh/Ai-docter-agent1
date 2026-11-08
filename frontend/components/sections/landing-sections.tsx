"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { agents, features, models, pipeline, stack } from "@/lib/landing";

const ease = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay, duration: 0.6, ease }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-l-accent">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] text-l-ink sm:text-4xl">{title}</h2>
      {body && <p className="mt-4 text-pretty text-lg leading-relaxed text-l-muted">{body}</p>}
    </Reveal>
  );
}

export function ProofStrip() {
  const items = [
    { k: "8", v: "specialist agents in one LangGraph" },
    { k: "5", v: "imaging models served on Hugging Face" },
    { k: "96.4%", v: "pneumonia sensitivity on 485 held-out X-rays" },
    { k: "0.40", v: "RAG confidence floor before web fallback" },
  ];
  return (
    <section aria-label="Key numbers" className="border-y border-l-line bg-l-card">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={it.v}
            className={`py-7 pr-4 ${i % 2 === 1 ? "pl-4 sm:pl-6" : ""} ${i > 0 ? "lg:border-l lg:border-l-line lg:pl-6" : ""} ${i < 2 ? "border-b border-l-line lg:border-b-0" : ""}`}
          >
            <dt className="sr-only">{it.v}</dt>
            <dd>
              <span className="block font-mono text-2xl font-medium tabular-nums tracking-tight text-l-ink sm:text-3xl">{it.k}</span>
              <span className="mt-1 block text-sm leading-snug text-l-muted">{it.v}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead
          eyebrow="What you can do"
          title="From a quick question to a full scan review"
          body="Each tool is a working page in the demo. Sign in and try any of them with your own files or the sample images."
        />
        <div className="grid gap-px overflow-hidden rounded-2xl border border-l-line bg-l-line sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.05} className="bg-l-card">
              <Link href={f.href} className="group flex h-full flex-col p-6 transition-colors hover:bg-l-accent-soft/60">
                <div className="mb-5 flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-lg bg-l-accent-soft text-l-accent">
                    <f.icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <ArrowUpRight className="size-4 text-l-muted opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </div>
                <h3 className="font-semibold tracking-tight text-l-ink">{f.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-l-muted">{f.body}</p>
                <p className="mt-5 font-mono text-[11px] text-l-muted">{f.detail}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pipeline() {
  return (
    <section id="pipeline" className="scroll-mt-20 border-t border-l-line bg-l-card py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <SectionHead
            eyebrow="How it works"
            title="A state machine, not a single prompt"
            body="Every message runs through the same LangGraph pipeline. Safety checks wrap both ends, and low-confidence answers fall back to live sources instead of guessing."
          />
          <Reveal>
            <p className="mb-3 text-sm font-medium text-l-ink">Agents the router can pick</p>
            <ul className="flex flex-wrap gap-2">
              {agents.map((a) => (
                <li key={a} className="rounded-full border border-l-line bg-l-bg px-3 py-1 text-sm text-l-muted">{a}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <ol className="relative">
          {pipeline.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.05}>
              <li className="relative grid grid-cols-[40px_1fr] gap-4 pb-8 last:pb-0">
                {i < pipeline.length - 1 && <span aria-hidden className="absolute left-[19px] top-10 h-[calc(100%-40px)] w-px bg-l-line" />}
                <span className={`grid size-10 place-items-center rounded-full border font-mono text-sm ${i === 2 ? "border-l-accent bg-l-accent text-l-accent-ink" : "border-l-line bg-l-bg text-l-muted"}`}>
                  {i + 1}
                </span>
                <div className="pt-2">
                  <h3 className="font-semibold tracking-tight text-l-ink">{p.step}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-l-muted">{p.note}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Models() {
  return (
    <section id="models" className="scroll-mt-20 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead
          eyebrow="Models"
          title="Real models, served as their own services"
          body="Imaging models run in separate Docker containers on Hugging Face Spaces, so the API stays light. Free hosting sleeps when idle; the app wakes the models when you open an imaging page."
        />
        <Reveal className="overflow-hidden rounded-2xl border border-l-line bg-l-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-l-line text-xs uppercase tracking-wider text-l-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Task</th>
                  <th scope="col" className="px-5 py-3 font-medium">Architecture</th>
                  <th scope="col" className="px-5 py-3 font-medium">Output</th>
                  <th scope="col" className="px-5 py-3 font-medium">Runtime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-l-line">
                {models.map((m) => (
                  <tr key={m.arch}>
                    <th scope="row" className="whitespace-nowrap px-5 py-4 font-medium text-l-ink">{m.task}</th>
                    <td className="px-5 py-4 font-mono text-xs text-l-ink">{m.arch}</td>
                    <td className="px-5 py-4 text-l-muted">{m.output}</td>
                    <td className="px-5 py-4 text-l-muted">{m.runtime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Stack() {
  return (
    <section id="stack" className="scroll-mt-20 border-t border-l-line bg-l-card py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow="Built with" title="Architecture and stack" />
        <Reveal className="mb-12 overflow-x-auto rounded-2xl border border-l-line bg-l-bg p-5 sm:p-8">
          <ArchitectureDiagram />
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {stack.map((s, i) => (
            <Reveal key={s.group} delay={i * 0.05}>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-l-muted">{s.group}</h3>
              <ul className="space-y-1.5 text-sm text-l-ink">
                {s.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Box({ title, sub, accent }: { title: string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${accent ? "border-l-accent bg-l-accent-soft" : "border-l-line bg-l-card"}`}>
      <p className="text-sm font-semibold text-l-ink">{title}</p>
      <p className="mt-0.5 text-xs text-l-muted">{sub}</p>
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-1 text-l-muted" aria-hidden>
      {label && <span className="mb-1 font-mono text-[10px]">{label}</span>}
      <svg width="40" height="10" viewBox="0 0 40 10" fill="none" className="hidden md:block">
        <path d="M0 5h36m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <svg width="10" height="24" viewBox="0 0 10 24" fill="none" className="md:hidden">
        <path d="M5 0v20m0 0-4-4m4 4 4-4" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <figure>
      <div className="grid items-center gap-2 md:grid-cols-[1fr_auto_1.1fr_auto_1fr]">
        <div className="space-y-2">
          <Box title="Next.js on Vercel" sub="Patient & doctor portals" />
          <Box title="Clerk" sub="Auth, signed JWTs" />
        </div>
        <Arrow label="REST + JWT" />
        <div className="space-y-2">
          <Box title="FastAPI" sub="Hugging Face Space · Docker" accent />
          <Box title="LangGraph agents" sub="Router, RAG, triage, guardrails" />
          <Box title="Postgres · Qdrant" sub="Supabase · local hybrid index" />
        </div>
        <Arrow label="HTTP" />
        <div className="space-y-2">
          <Box title="PyTorch Space" sub="MRI, COVID X-ray, skin lesion" />
          <Box title="TensorFlow Space" sub="Pneumonia X-ray" />
          <Box title="Gemini · Groq · Tavily" sub="Hosted LLMs and search" />
        </div>
      </div>
      <figcaption className="sr-only">
        The Next.js frontend authenticates with Clerk and calls the FastAPI backend, which runs the LangGraph agents with Postgres and Qdrant, and calls separate PyTorch and TensorFlow model services plus hosted LLM and search APIs.
      </figcaption>
    </figure>
  );
}

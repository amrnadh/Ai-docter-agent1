"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Check, Code2, ShieldCheck } from "lucide-react";
import { author } from "@/lib/landing";

const ease = [0.16, 1, 0.3, 1] as const;

function TraceStep({ label, active, delay }: { label: string; active?: boolean; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease }}
      className={
        active
          ? "inline-flex items-center gap-1 rounded-full bg-l-accent px-2.5 py-1 text-[11px] font-medium text-l-accent-ink"
          : "inline-flex items-center gap-1 rounded-full border border-l-line bg-l-bg px-2.5 py-1 text-[11px] text-l-muted"
      }
    >
      {!active && <Check className="size-3" aria-hidden />}
      {label}
    </motion.span>
  );
}

const probs = [
  { label: "Glioma", p: 0.91 },
  { label: "Meningioma", p: 0.05 },
  { label: "Pituitary", p: 0.03 },
  { label: "No tumor", p: 0.01 },
];

/** Illustrative product snapshot built from real UI concepts, no screenshots. */
function HeroVisual() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-label="Example of an assistant answer and an MRI result">
      <div className="rounded-2xl border border-l-line bg-l-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_-12px_rgba(0,0,0,0.12)] sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-medium text-l-muted">Assistant</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-l-muted">example</span>
        </div>

        <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-l-ink px-3.5 py-2 text-sm text-l-bg">
          I take warfarin. Is ibuprofen OK for a headache?
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <TraceStep label="Guardrail" delay={0.5} />
          <TraceStep label="Router" delay={0.7} />
          <TraceStep label="Drug-interaction agent" active delay={0.9} />
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-3 rounded-2xl rounded-bl-md border border-l-line bg-l-bg px-3.5 py-3 text-sm leading-relaxed text-l-ink"
        >
          <span className="mb-1.5 inline-flex items-center rounded bg-l-warn/15 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-l-warn">
            Severe interaction
          </span>
          <p>
            NSAIDs like ibuprofen raise bleeding risk with warfarin. Paracetamol is usually the safer choice. Check with your doctor before combining them.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6, ease }}
        className="relative mt-4 rounded-2xl border border-l-line bg-l-card p-4 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] sm:-mt-6 sm:ml-12 sm:p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-l-muted">Brain MRI · ensemble</span>
          <span className="font-mono text-[10px] text-l-muted">uncertainty 0.07</span>
        </div>
        <ul className="space-y-2">
          {probs.map((r, i) => (
            <li key={r.label} className="grid grid-cols-[88px_1fr_40px] items-center gap-3 text-xs">
              <span className={i === 0 ? "font-medium text-l-ink" : "text-l-muted"}>{r.label}</span>
              <span className="h-1.5 overflow-hidden rounded-full bg-l-line">
                <motion.span
                  className={i === 0 ? "block h-full rounded-full bg-l-accent" : "block h-full rounded-full bg-l-muted/50"}
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${Math.max(r.p * 100, 2)}%` }}
                  transition={{ delay: 1.8 + i * 0.08, duration: 0.8, ease }}
                />
              </span>
              <span className="text-right font-mono tabular-nums text-l-muted">{Math.round(r.p * 100)}%</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const { user } = useUser();
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.7, ease } };

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--l-line)_1px,transparent_1px),linear-gradient(90deg,var(--l-line)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_0%,#000_20%,transparent_75%)] opacity-60"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-12 sm:px-6 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-28">
        <div>
          <motion.p {...fade(0)} className="mb-5 inline-flex items-center gap-2 rounded-full border border-l-line bg-l-card px-3 py-1 text-xs font-medium text-l-muted">
            <span className="size-1.5 rounded-full bg-l-accent" aria-hidden />
            Multi-agent clinical AI · open source
          </motion.p>

          <motion.h1 {...fade(0.08)} className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-l-ink sm:text-5xl lg:text-6xl">
            Eight AI specialists. <span className="text-l-accent">One second opinion.</span>
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-l-muted">
            MedSage routes every question, scan and lab report to the right agent: a RAG agent grounded in clinical papers, CNN ensembles for MRI and X-ray, and triage and drug-safety agents that know your health profile.
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={user ? "/dashboard" : "/sign-up"}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-l-ink px-6 text-[15px] font-medium text-l-bg transition-opacity hover:opacity-90"
            >
              {user ? "Open dashboard" : "Try the live demo"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <a
              href="#pipeline"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-l-line bg-l-card px-6 text-[15px] font-medium text-l-ink transition-colors hover:border-l-muted/40"
            >
              See how it works
            </a>
          </motion.div>

          <motion.ul {...fade(0.32)} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-l-muted">
            <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-l-accent" aria-hidden />Guardrails on input and output</li>
            {author.source && (
              <li>
                <a href={author.source} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline-offset-4 hover:text-l-ink hover:underline">
                  <Code2 className="size-4 text-l-accent" aria-hidden />View the source
                </a>
              </li>
            )}
          </motion.ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

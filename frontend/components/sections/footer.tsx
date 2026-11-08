"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { FaGithub, FaGitlab, FaLinkedin } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { author } from "@/lib/landing";
import { Logo } from "./header";

export function ClosingCta() {
  const { user } = useUser();
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-l-ink px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,var(--l-accent),transparent_70%)] opacity-30"
          />
          <h2 className="relative mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em] text-l-bg sm:text-4xl">
            Try it with your own question or scan.
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-pretty text-l-bg/70">
            Free to use. Sign up takes a few seconds, and a short onboarding sets up the health profile the agents use.
          </p>
          <Link
            href={user ? "/dashboard" : "/sign-up"}
            className="relative mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-l-bg px-6 text-[15px] font-medium text-l-ink transition-opacity hover:opacity-90"
          >
            {user ? "Open dashboard" : "Try the live demo"}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Footer() {
  const links = [
    { href: author.source, label: "Source code", icon: author.source.includes("gitlab") ? FaGitlab : FaGithub },
    { href: author.github, label: "GitHub", icon: FaGithub },
    { href: author.linkedin, label: "LinkedIn", icon: FaLinkedin },
    { href: author.portfolio, label: "Portfolio", icon: CgWebsite },
  ].filter((l) => l.href);

  return (
    <footer className="border-t border-l-line">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Logo />
            <p className="mt-2 text-sm text-l-muted">Designed and built by {author.name}.</p>
          </div>
          {links.length > 0 && (
            <ul className="flex items-center gap-1">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer" aria-label={l.label} className="grid size-10 place-items-center rounded-full text-l-muted transition-colors hover:bg-l-line/60 hover:text-l-ink">
                    <l.icon className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-8 border-t border-l-line pt-6 text-xs leading-relaxed text-l-muted">
          MedSage is a research and portfolio project, not a medical device. Its output is not a diagnosis. Always consult a qualified clinician, and call your local emergency number in an emergency.
        </p>
      </div>
    </footer>
  );
}

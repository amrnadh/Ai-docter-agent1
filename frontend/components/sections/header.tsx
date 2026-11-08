"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#pipeline" },
  { label: "Models", href: "#models" },
  { label: "Stack", href: "#stack" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-semibold tracking-tight text-l-ink", className)}>
      <span aria-hidden className="grid size-7 place-items-center rounded-md bg-l-accent text-l-accent-ink">
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8 3v10M3 8h10" />
        </svg>
      </span>
      MedSage
    </Link>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors",
        scrolled || open ? "border-l-line bg-l-bg/85 backdrop-blur-md" : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm text-l-muted transition-colors hover:text-l-ink">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignedIn>
            <Link href="/dashboard" className="hidden h-9 items-center rounded-full bg-l-ink px-4 text-sm font-medium text-l-bg transition-opacity hover:opacity-90 sm:inline-flex">
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="hidden h-9 items-center rounded-full px-4 text-sm font-medium text-l-ink hover:bg-l-line/60 sm:inline-flex">
              Sign in
            </Link>
            <Link href="/sign-up" className="hidden h-9 items-center rounded-full bg-l-ink px-4 text-sm font-medium text-l-bg transition-opacity hover:opacity-90 sm:inline-flex">
              Try the demo
            </Link>
          </SignedOut>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-md text-l-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-l-line px-4 pb-4 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col py-2">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2.5 text-l-ink">
                {n.label}
              </a>
            ))}
          </nav>
          <SignedOut>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/sign-in" className="inline-flex h-10 items-center justify-center rounded-full border border-l-line text-sm font-medium text-l-ink">
                Sign in
              </Link>
              <Link href="/sign-up" className="inline-flex h-10 items-center justify-center rounded-full bg-l-ink text-sm font-medium text-l-bg">
                Try the demo
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="inline-flex h-10 w-full items-center justify-center rounded-full bg-l-ink text-sm font-medium text-l-bg">
              Open dashboard
            </Link>
          </SignedIn>
        </div>
      )}
    </header>
  );
}

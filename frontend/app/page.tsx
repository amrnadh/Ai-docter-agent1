import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import { Features, Models, Pipeline, ProofStrip, Stack } from "@/components/sections/landing-sections";
import Footer, { ClosingCta } from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-l-bg text-l-ink antialiased">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-l-card focus:px-3 focus:py-2">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <ProofStrip />
        <Features />
        <Pipeline />
        <Models />
        <Stack />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}

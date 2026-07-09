import { CliDemoSection } from "@/components/landing/cli-demo-section";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingNav } from "@/components/landing/landing-nav";
import { StackPowerSection } from "@/components/landing/stack-power-section";

export function LandingPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <LandingNav />

      <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <LandingHero />
        <CliDemoSection />
        <StackPowerSection />
      </div>
    </main>
  );
}

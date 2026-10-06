import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { HowItWorks } from "@/components/how-it-works";
import { Capabilities } from "@/components/capabilities";
import { Principles } from "@/components/principles";
import { Trust } from "@/components/trust";
import { WaitlistCta } from "@/components/waitlist-cta";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Problem />
        <HowItWorks />
        <Capabilities />
        <Principles />
        <Trust />
        <WaitlistCta />
      </main>
      <SiteFooter />
    </>
  );
}

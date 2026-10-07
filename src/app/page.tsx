import { SmoothScroll } from "@/components/smooth-scroll";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { HowItWorks } from "@/components/how-it-works";
import { Capabilities } from "@/components/capabilities";
import { TryItNow } from "@/components/try-it-now";
import { BuiltForIndia } from "@/components/built-for-india";
import { Principles } from "@/components/principles";
import { Transparency } from "@/components/transparency";
import { Trust } from "@/components/trust";
import { WaitlistCta } from "@/components/waitlist-cta";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <SmoothScroll>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Problem />
        <HowItWorks />
        <Capabilities />
        <TryItNow />
        <BuiltForIndia />
        <Principles />
        <Transparency />
        <Trust />
        <WaitlistCta />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}

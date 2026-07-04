"use client";

import Reveal from "@/components/ui/Reveal";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import Marquee from "@/components/ui/Marquee";
import { CAPABILITIES } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="section relative">
      <div className="shell">
        <div className="flex flex-col gap-4 border-t border-[color-mix(in_oklab,var(--paper)_10%,transparent)] pt-8 md:flex-row md:items-baseline md:justify-between">
          <span className="eyebrow">01 — The Studio</span>
          <span className="font-mono text-[0.68rem] tracking-[0.14em] text-[var(--color-stone-500)] uppercase">
            Est. 2019 · Worldwide
          </span>
        </div>

        <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <AnimatedHeading
              as="h2"
              className="display-l text-[var(--paper)]"
              text="We are a creative technology studio for companies that refuse to be forgotten."
            />
          </div>
          <div className="flex flex-col justify-end gap-6 lg:col-span-4">
            <Reveal className="lead text-[var(--color-stone-300)]">
              We don&rsquo;t just design websites. We build digital products, engineer AI
              automations, craft brands, and create the systems that make companies
              unforgettable — all under one roof, held to a single standard.
            </Reveal>
            <Reveal delay={0.1}>
              <div className="font-mono text-[0.7rem] leading-relaxed tracking-[0.06em] text-[var(--color-stone-500)]">
                <p>Design &amp; engineering as one discipline.</p>
                <p>Taste, defended with reasons.</p>
                <p>Craft, all the way to the edge case.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mt-24 border-y border-[color-mix(in_oklab,var(--paper)_10%,transparent)] py-8">
        <Marquee
          items={CAPABILITIES}
          className="display-l font-light text-[var(--color-stone-500)]"
          speed={60}
        />
      </div>
    </section>
  );
}

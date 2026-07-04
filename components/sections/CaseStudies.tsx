"use client";

import { useRef } from "react";
import Plate from "@/components/ui/Plate";
import Reveal from "@/components/ui/Reveal";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import { CASE_STUDIES, type CaseStudy } from "@/lib/data";
import { registerGsap, gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, usePrefersReducedMotion } from "@/lib/hooks";
import { cursorProps } from "@/lib/cursor";

function Study({ study, i }: { study: CaseStudy; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const flip = i % 2 === 1;

  useIsoLayoutEffect(() => {
    if (reduced || !plateRef.current) return;
    const { gsap: g } = registerGsap();
    const ctx = g.context(() => {
      g.to(plateRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={ref} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <a
        href="#contact"
        {...cursorProps("view", "Read")}
        className={`group relative block overflow-hidden lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
        style={{ aspectRatio: "16 / 11" }}
      >
        <div ref={plateRef} className="absolute inset-x-0 -top-[12%] bottom-[12%] will-change-transform">
          <Plate kind={study.kind} tone={study.tone} seed={i + 40} index={`CASE 0${i + 1}`} label={study.year} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,7,6,0.55)] to-transparent" />
        <div className="absolute bottom-0 left-0 p-7">
          <span className="font-mono text-[0.66rem] tracking-[0.18em] text-[var(--color-paper-100)] uppercase">
            {study.client}
          </span>
        </div>
      </a>

      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <span className="eyebrow">{study.discipline}</span>
        <AnimatedHeading as="h3" className="display-l mt-5 text-[var(--paper)]" text={study.title} />
        <Reveal className="mt-6 text-[var(--color-stone-300)] lead" delay={0.05}>
          {study.narrative}
        </Reveal>
        <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[color-mix(in_oklab,var(--paper)_10%,transparent)] pt-8">
          {study.metrics.map((m, mi) => (
            <Reveal key={mi} delay={mi * 0.08}>
              <div className="font-display text-[clamp(1.8rem,4vw,3rem)] font-light leading-none text-[var(--accent-bright)]">
                {m.value}
              </div>
              <div className="mt-2 font-mono text-[0.6rem] leading-snug tracking-[0.08em] text-[var(--color-stone-400)] uppercase">
                {m.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CaseStudies() {
  return (
    <section id="case-studies" className="section">
      <div className="shell">
        <div className="flex flex-col gap-4 border-t border-[color-mix(in_oklab,var(--paper)_10%,transparent)] pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">05 — Case Studies</span>
            <h2 className="display-xl mt-6 max-w-[13ch] text-[var(--paper)]">
              The story behind the <span className="italic-serif text-[var(--color-stone-300)]">numbers.</span>
            </h2>
          </div>
          <p className="max-w-[32ch] text-[var(--color-stone-300)]">
            Every engagement is a documentary — the before, the decision, and the
            measurable after.
          </p>
        </div>

        <div className="mt-24 flex flex-col gap-28 md:gap-40">
          {CASE_STUDIES.map((s, i) => (
            <Study key={s.id} study={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

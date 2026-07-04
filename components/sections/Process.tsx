"use client";

import { useRef } from "react";
import { PROCESS } from "@/lib/data";
import { registerGsap, gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, usePrefersReducedMotion } from "@/lib/hooks";

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsoLayoutEffect(() => {
    if (reduced) return;
    const { gsap: g } = registerGsap();
    const ctx = g.context(() => {
      g.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 60%", end: "bottom 80%", scrub: true },
        }
      );
      g.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
        g.fromTo(
          step,
          { opacity: 0.25, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: step, start: "top 78%" },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="process" className="section">
      <div className="shell" ref={ref}>
        <div className="border-t border-[color-mix(in_oklab,var(--paper)_10%,transparent)] pt-8">
          <span className="eyebrow">06 — The Process</span>
          <h2 className="display-xl mt-6 max-w-[16ch] text-[var(--paper)]">
            Four movements, one <span className="italic-serif text-[var(--color-stone-300)]">standard.</span>
          </h2>
        </div>

        <div className="relative mt-20 pl-8 md:pl-0">
          {/* progress rail */}
          <div className="absolute left-0 top-0 h-full w-px bg-[color-mix(in_oklab,var(--paper)_10%,transparent)] md:left-[calc(33.333%-1px)]">
            <div ref={line} className="absolute inset-x-0 top-0 h-full origin-top bg-[var(--accent)]" />
          </div>

          <div className="flex flex-col">
            {PROCESS.map((p) => (
              <div
                key={p.n}
                data-step
                className="grid gap-4 border-b border-[color-mix(in_oklab,var(--paper)_8%,transparent)] py-12 last:border-b-0 md:grid-cols-3 md:gap-10"
              >
                <div className="flex items-baseline gap-5 md:pr-12">
                  <span className="font-mono text-[0.7rem] tracking-[0.16em] text-[var(--accent)]">{p.n}</span>
                  <h3 className="display-l text-[var(--paper)]">{p.title}</h3>
                </div>
                <p className="max-w-[46ch] text-[var(--color-stone-300)] md:col-span-2 md:pl-12 lead">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

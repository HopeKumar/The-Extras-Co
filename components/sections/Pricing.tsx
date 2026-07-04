"use client";

import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { PLANS } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="shell">
        <div className="flex flex-col gap-4 border-t border-[color-mix(in_oklab,var(--paper)_10%,transparent)] pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">09 — Engagements</span>
            <h2 className="display-xl mt-6 max-w-[14ch] text-[var(--paper)]">
              Priced to the <span className="italic-serif text-[var(--color-stone-300)]">outcome.</span>
            </h2>
          </div>
          <p className="max-w-[32ch] text-[var(--color-stone-300)]">
            Three ways to work together. Every engagement is scoped in a candid first
            conversation — no surprises, no inflated retainers.
          </p>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <div
                className={cn(
                  "group relative flex h-full flex-col justify-between overflow-hidden rounded-sm border p-8 transition-colors duration-500 md:p-10",
                  p.featured
                    ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_8%,var(--ink))]"
                    : "border-[color-mix(in_oklab,var(--paper)_12%,transparent)] hover:border-[color-mix(in_oklab,var(--paper)_28%,transparent)]"
                )}
              >
                {p.featured && (
                  <span className="absolute right-6 top-6 font-mono text-[0.58rem] tracking-[0.2em] text-[var(--accent-bright)] uppercase">
                    Most chosen
                  </span>
                )}
                <div>
                  <h3 className="font-display text-2xl font-light text-[var(--paper)]">{p.name}</h3>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-5xl font-light text-[var(--paper)]">{p.price}</span>
                  </div>
                  <span className="mt-2 block font-mono text-[0.62rem] tracking-[0.14em] text-[var(--color-stone-400)] uppercase">
                    {p.cadence}
                  </span>
                  <p className="mt-6 text-[0.95rem] leading-relaxed text-[var(--color-stone-300)]">{p.summary}</p>

                  <ul className="mt-8 flex flex-col gap-3 border-t border-[color-mix(in_oklab,var(--paper)_10%,transparent)] pt-8">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-[0.9rem] text-[var(--color-paper-100)]">
                        <span className="mt-[7px] block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10">
                  <MagneticButton
                    href="#contact"
                    variant={p.featured ? "solid" : "outline"}
                    className="w-full"
                    strength={0.2}
                  >
                    Begin here
                  </MagneticButton>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

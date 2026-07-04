"use client";

import { useRef, useState } from "react";
import { RESULTS } from "@/lib/data";
import { registerGsap, gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, usePrefersReducedMotion } from "@/lib/hooks";

function Counter({ value, suffix }: { value: string; suffix: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : "0");
  const decimals = value.includes(".") ? value.split(".")[1].length : 0;

  useIsoLayoutEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const { gsap: g } = registerGsap();
    const obj = { v: 0 };
    const target = parseFloat(value);
    const ctx = g.context(() => {
      g.to(obj, {
        v: target,
        duration: 2,
        ease: "expo.out",
        scrollTrigger: { trigger: el.current, start: "top 85%", once: true },
        onUpdate: () => setDisplay(obj.v.toFixed(decimals)),
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <span ref={el} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

export default function Results() {
  return (
    <section id="results" className="section relative">
      <div className="shell">
        <div className="border-t border-[color-mix(in_oklab,var(--paper)_10%,transparent)] pt-8">
          <span className="eyebrow">07 — Client Results</span>
          <h2 className="display-l mt-6 max-w-[20ch] text-[var(--paper)]">
            Beauty is the strategy. <span className="italic-serif text-[var(--color-stone-300)]">These are the outcomes.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {RESULTS.map((r, i) => (
            <div key={i} className="border-t border-[color-mix(in_oklab,var(--paper)_12%,transparent)] pt-6">
              <div className="font-display text-[clamp(3rem,7vw,5.5rem)] font-light leading-none text-[var(--accent-bright)]">
                <Counter value={r.value} suffix={r.suffix} />
              </div>
              <h3 className="mt-5 text-[1.05rem] text-[var(--paper)]">{r.label}</h3>
              <p className="mt-1 font-mono text-[0.62rem] tracking-[0.08em] text-[var(--color-stone-500)] uppercase">
                {r.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

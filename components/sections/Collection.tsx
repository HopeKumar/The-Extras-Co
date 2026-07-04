"use client";

import { useEffect, useRef } from "react";
import Plate from "@/components/ui/Plate";
import { COLLECTION } from "@/lib/data";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { cursorProps } from "@/lib/cursor";
import { usePrefersReducedMotion } from "@/lib/hooks";

export default function Collection() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const sec = section.current!;
    const tr = track.current!;
    registerGsap();
    const mm = gsap.matchMedia();
    // Horizontal-scroll pin only on desktop; mobile falls back to native swipe.
    mm.add("(min-width: 768px)", () => {
      const getX = () => Math.max(0, tr.scrollWidth - window.innerWidth + 96);
      const tween = gsap.to(tr, {
        x: () => -getX(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${getX()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.kill();
    });
    return () => mm.revert();
  }, [reduced]);

  return (
    <section id="collection" ref={section} className="relative overflow-hidden py-24 md:py-0 md:h-[100svh] md:flex md:flex-col md:justify-center">
      <div className="shell mb-14 md:mb-0 md:absolute md:top-[calc(var(--nav-h)+2rem)] md:left-0 md:right-0 md:z-10">
        <div className="flex items-end justify-between border-t border-[color-mix(in_oklab,var(--paper)_10%,transparent)] pt-8">
          <div>
            <span className="eyebrow">03 — Premium Collection</span>
            <h2 className="display-l mt-5 text-[var(--paper)]">The house catalogue.</h2>
          </div>
          <span className="hidden font-mono text-[0.66rem] tracking-[0.16em] text-[var(--color-stone-500)] uppercase md:block">
            Drag / Scroll →
          </span>
        </div>
      </div>

      <div className="overflow-x-auto md:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div
        ref={track}
        className="flex w-max gap-6 px-[var(--gutter)] will-change-transform md:mt-24"
        {...cursorProps("drag", "Drag")}
      >
        {COLLECTION.map((p, i) => (
          <a
            key={p.id}
            href="#contact"
            className="group relative block h-[52vh] w-[78vw] shrink-0 overflow-hidden sm:w-[46vw] lg:h-[62vh] lg:w-[32vw]"
          >
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
              <Plate kind={p.kind} tone={p.tone} seed={i + 21} index={`C${i + 1}`} />
            </div>
            <div className="absolute inset-0 flex flex-col justify-between p-7">
              <span className="font-mono text-[0.62rem] tracking-[0.2em] text-[var(--color-stone-300)] uppercase">
                {p.discipline}
              </span>
              <div>
                <h3 className="font-display text-3xl font-light text-[var(--paper)]">{p.title}</h3>
                <span className="mt-1 block font-mono text-[0.62rem] tracking-[0.16em] text-[var(--color-stone-400)] uppercase">
                  {p.client} · {p.year}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { LogoMark } from "@/components/ui/Logo";

export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    // Lock scroll while loading.
    document.documentElement.classList.add("lenis-stopped");
    document.body.style.overflow = "hidden";

    const finish = () => {
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
      onDone();
    };

    if (reduced) {
      const t = window.setTimeout(finish, 300);
      return () => window.clearTimeout(t);
    }

    const { gsap: g } = registerGsap();
    const ctx = g.context(() => {
      const strokes = root.current!.querySelectorAll<SVGPathElement>("[data-logo-stroke]");
      strokes.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      });
      const node = root.current!.querySelector("[data-logo-node]");
      const bpEls = root.current!.querySelectorAll(".bp-el");
      if (node) g.set(node, { opacity: 0, scale: 0, transformOrigin: "center" });

      const counter = { v: 0 };
      const tl = g.timeline({ defaults: { ease: "expo.out" }, onComplete: finish });

      tl.to(bpEls, {
        opacity: 1,
        duration: 1.2,
        stagger: 0.03,
        ease: "power2.out",
      })
        .to(strokes, { strokeDashoffset: 0, duration: 1.5, stagger: 0.25 }, 0.3)
        .to(node, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" }, "-=0.5")
        .to(
          counter,
          {
            v: 100,
            duration: 2.2,
            ease: "power2.inOut",
            onUpdate: () => {
              const val = Math.round(counter.v);
              setCount(val);
              if (countRef.current) countRef.current.style.setProperty("--p", `${val}`);
            },
          },
          0.1
        )
        .to(".loader-meta", { opacity: 1, duration: 0.8 }, 0.4)
        // Assemble → settle → dissolve
        .to(".loader-logo", { scale: 1.04, duration: 0.6, ease: "power2.inOut" }, "+=0.1")
        .to(".loader-line-x", { scaleX: 1, duration: 1, ease: "expo.inOut" }, "-=0.3")
        .to(".loader-content", { yPercent: -8, opacity: 0, duration: 0.9, ease: "power3.in" }, "+=0.2")
        .to(root.current, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.5");
    }, root.current!);

    return () => {
      ctx.revert();
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
    };
  }, [reduced, onDone]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[var(--ink)]"
      role="status"
      aria-label="Loading The Extras & Co."
    >
      <div className="loader-content relative flex w-full max-w-[520px] flex-col items-center px-8">
        {/* Blueprint field */}
        <svg
          className="loader-blueprint pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2"
          viewBox="0 0 360 360"
          fill="none"
        >
          <g stroke="var(--color-stone-500)" strokeWidth="0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 45} x2="360" y2={i * 45} className="bp-el" opacity="0" />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 45} y1="0" x2={i * 45} y2="360" className="bp-el" opacity="0" />
            ))}
          </g>
          <circle cx="180" cy="180" r="120" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.4" opacity="0" className="bp-el" />
        </svg>

        {/* Logo assembling */}
        <div className="loader-logo relative z-10 h-24 w-24 text-[var(--paper)]">
          <LogoMark />
        </div>

        <div className="loader-line-x mt-10 h-px w-[220px] origin-left scale-x-0 bg-[color-mix(in_oklab,var(--paper)_24%,transparent)]" />

        {/* Meta row */}
        <div className="loader-meta mt-6 flex w-full items-center justify-between opacity-0">
          <span className="font-mono text-[0.62rem] tracking-[0.22em] text-[var(--color-stone-400)] uppercase">
            The&nbsp;Extras&nbsp;&amp;&nbsp;Co.
          </span>
          <span ref={countRef} className="font-mono text-[0.62rem] tracking-[0.22em] text-[var(--color-stone-300)] tabular-nums">
            {String(count).padStart(3, "0")}
          </span>
        </div>

        <span className="loader-meta mt-3 self-start font-mono text-[0.58rem] tracking-[0.2em] text-[var(--color-stone-500)] uppercase opacity-0">
          Constructing the experience
        </span>
      </div>
    </div>
  );
}

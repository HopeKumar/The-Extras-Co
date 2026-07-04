"use client";

import { useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Props = {
  items: string[];
  speed?: number;
  className?: string;
  separator?: string;
};

/** Seamless, scroll-velocity-aware marquee. */
export default function Marquee({ items, speed = 40, className, separator = "—" }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsoLayoutEffect(() => {
    const el = track.current;
    if (!el || reduced) return;
    const { gsap: g } = registerGsap();
    const ctx = g.context(() => {
      const half = el.scrollWidth / 2;
      const tween = g.to(el, { x: -half, duration: half / speed, ease: "none", repeat: -1 });
      const st = registerGsap().ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = Math.min(4, 1 + Math.abs(self.getVelocity()) / 600);
          gsap.to(tween, { timeScale: self.direction === -1 ? -v : v, duration: 0.4, overwrite: true });
        },
      });
      return () => st.kill();
    }, track);
    return () => ctx.revert();
  }, [reduced, speed]);

  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span>{it}</span>
          <span className="mx-8 text-[var(--accent)] opacity-70">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("relative w-full overflow-hidden", className)} aria-hidden="true">
      <div ref={track} className="flex w-max will-change-transform">
        {row}
        {row}
      </div>
    </div>
  );
}

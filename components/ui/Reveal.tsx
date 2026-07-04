"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { useIsoLayoutEffect, usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
  delay?: number;
  duration?: number;
  start?: string;
  once?: boolean;
};

/** Generic scroll-triggered fade + rise. GPU-only (transform + opacity). */
export default function Reveal({
  children,
  as: Tag = "div",
  className,
  y = 40,
  delay = 0,
  duration = 1.1,
  start = "top 88%",
  once = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    const { gsap: g } = registerGsap();
    const ctx = g.context(() => {
      g.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start, toggleActions: once ? "play none none none" : "play reverse play reverse" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <Tag ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}

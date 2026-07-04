"use client";

import { useRef, type ReactNode } from "react";
import { setCursor, resetCursor } from "@/lib/cursor";
import { useIsDesktopPointer, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  variant?: "solid" | "outline" | "ghost";
  ariaLabel?: string;
};

export default function MagneticButton({
  children,
  href,
  onClick,
  className,
  strength = 0.35,
  variant = "solid",
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const fine = useIsDesktopPointer();
  const reduced = usePrefersReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (!fine || reduced || !ref.current || !inner.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    inner.current.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0)`;
  };
  const onLeave = () => {
    resetCursor();
    if (!ref.current || !inner.current) return;
    ref.current.style.transform = "translate3d(0,0,0)";
    inner.current.style.transform = "translate3d(0,0,0)";
  };

  const base =
    "relative inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-[0.82rem] font-medium tracking-[0.02em] transition-colors duration-500 will-change-transform";
  const variants = {
    solid: "bg-[var(--paper)] text-[#0a0806] hover:bg-[var(--accent-bright)]",
    outline:
      "border border-[color-mix(in_oklab,var(--paper)_28%,transparent)] text-[var(--paper)] hover:border-[var(--accent)]",
    ghost: "text-[var(--paper)]",
  } as const;

  const content = (
    <span
      ref={inner}
      className="pointer-events-none inline-flex items-center gap-3"
      style={{ transition: "transform .6s var(--ease-out-expo)" }}
    >
      {children}
    </span>
  );

  const wrapStyle = { transition: "transform .6s var(--ease-out-expo)" } as const;
  const cls = cn(base, variants[variant], className);

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setCursor({ variant: "hover" })}
      onMouseLeave={onLeave}
      style={{ display: "inline-flex", willChange: "transform", ...wrapStyle }}
    >
      {href ? (
        <a href={href} className={cls} aria-label={ariaLabel}>
          {content}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={cls} aria-label={ariaLabel}>
          {content}
        </button>
      )}
    </span>
  );
}

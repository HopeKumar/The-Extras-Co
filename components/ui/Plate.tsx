"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

export type PlateKind =
  | "monolith"
  | "topographic"
  | "aperture"
  | "strata"
  | "grid"
  | "arch";

type Props = {
  kind?: PlateKind;
  seed?: number;
  className?: string;
  tone?: "stone" | "graphite" | "champagne" | "obsidian";
  label?: string;
  index?: string;
};

/* Small seeded PRNG so a given seed is stable across renders/SSR. */
function mulberry(seed: number) {
  let a = seed + 0x6d2b79f5;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TONES: Record<string, { a: string; b: string; c: string; line: string }> = {
  stone: { a: "#2a2620", b: "#171310", c: "#3c352c", line: "#c4bbac" },
  graphite: { a: "#232323", b: "#0e0e0e", c: "#343434", line: "#b8b8b8" },
  champagne: { a: "#33281c", b: "#160f09", c: "#4a3620", line: "#d8a978" },
  obsidian: { a: "#14120f", b: "#080706", c: "#211d18", line: "#9a8f80" },
};

/**
 * Generative editorial visual. Renders a premium architectural composition
 * with layered material gradients, soft light and fine line-work — no
 * placeholders, no external images.
 */
export default function Plate({
  kind = "monolith",
  seed = 1,
  className,
  tone = "stone",
  label,
  index,
}: Props) {
  const t = TONES[tone];
  const id = useMemo(() => `p${seed}-${kind}`, [seed, kind]);
  const rnd = useMemo(() => mulberry(seed * 97 + 13), [seed]);

  const contours = useMemo(() => {
    const lines: string[] = [];
    for (let i = 0; i < 9; i++) {
      const r = 40 + i * 34 + rnd() * 8;
      lines.push(`M ${300 - r} 300 a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`);
    }
    return lines;
  }, [rnd]);

  const strata = useMemo(
    () => Array.from({ length: 7 }, (_, i) => 60 + i * 68 + Math.round(rnd() * 22)),
    [rnd]
  );

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{ background: `linear-gradient(150deg, ${t.a} 0%, ${t.b} 62%, ${t.c} 100%)` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id={`${id}-light`} cx="30%" cy="18%" r="90%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
          </radialGradient>
          <linearGradient id={`${id}-slab`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={t.line} stopOpacity="0.14" />
            <stop offset="100%" stopColor={t.line} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {kind === "monolith" && (
          <g stroke={t.line} strokeOpacity="0.5" strokeWidth="1" fill="none">
            <rect x="210" y="90" width="180" height="430" fill={`url(#${id}-slab)`} stroke={t.line} strokeOpacity="0.35" />
            <line x1="210" y1="150" x2="390" y2="150" strokeOpacity="0.2" />
            <line x1="300" y1="90" x2="300" y2="520" strokeOpacity="0.15" />
            <line x1="70" y1="520" x2="530" y2="520" strokeOpacity="0.4" />
            <circle cx="300" cy="300" r="3" fill={t.line} stroke="none" />
          </g>
        )}

        {kind === "topographic" && (
          <g stroke={t.line} strokeWidth="1" fill="none" strokeOpacity="0.34">
            {contours.map((d, i) => (
              <path key={i} d={d} strokeOpacity={0.12 + (i / contours.length) * 0.3} />
            ))}
          </g>
        )}

        {kind === "aperture" && (
          <g stroke={t.line} strokeWidth="1" fill="none">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={300 + Math.cos(a) * 70}
                  y1={300 + Math.sin(a) * 70}
                  x2={300 + Math.cos(a) * 230}
                  y2={300 + Math.sin(a) * 230}
                  strokeOpacity="0.18"
                />
              );
            })}
            <circle cx="300" cy="300" r="72" strokeOpacity="0.5" />
            <circle cx="300" cy="300" r="150" strokeOpacity="0.22" />
            <circle cx="300" cy="300" r="228" strokeOpacity="0.12" />
          </g>
        )}

        {kind === "strata" && (
          <g stroke={t.line} strokeWidth="1" strokeOpacity="0.24" fill="none">
            {strata.map((y, i) => (
              <line key={i} x1="0" y1={y} x2="600" y2={y - 40 + rnd() * 80} strokeOpacity={0.1 + (i % 3) * 0.08} />
            ))}
          </g>
        )}

        {kind === "grid" && (
          <g stroke={t.line} strokeWidth="1" strokeOpacity="0.16" fill="none">
            {Array.from({ length: 13 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="600" />
            ))}
            {Array.from({ length: 13 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} />
            ))}
            <rect x="150" y="150" width="300" height="300" stroke={t.line} strokeOpacity="0.4" fill={`url(#${id}-slab)`} />
          </g>
        )}

        {kind === "arch" && (
          <g stroke={t.line} strokeWidth="1" fill="none" strokeOpacity="0.4">
            <path d="M 140 520 L 140 260 A 160 160 0 0 1 460 260 L 460 520" strokeOpacity="0.42" fill={`url(#${id}-slab)`} />
            <path d="M 200 520 L 200 285 A 100 100 0 0 1 400 285 L 400 520" strokeOpacity="0.24" />
            <line x1="60" y1="520" x2="540" y2="520" strokeOpacity="0.5" />
          </g>
        )}

        <rect x="0" y="0" width="600" height="600" fill={`url(#${id}-light)`} />
      </svg>

      {(label || index) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5">
          <span className="font-mono text-[0.62rem] tracking-[0.22em] text-[var(--color-stone-300)] uppercase opacity-70">
            {index}
          </span>
          {label && (
            <span className="font-mono text-[0.62rem] tracking-[0.22em] text-[var(--color-stone-300)] uppercase opacity-70">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useRef } from "react";
import Plate from "@/components/ui/Plate";
import Reveal from "@/components/ui/Reveal";
import { FEATURED, type Project } from "@/lib/data";
import { setCursor, resetCursor } from "@/lib/cursor";
import { useIsDesktopPointer, usePrefersReducedMotion } from "@/lib/hooks";

function GalleryItem({ project, i }: { project: Project; i: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const fine = useIsDesktopPointer();
  const reduced = usePrefersReducedMotion();
  const wide = i % 3 === 0;

  const onMove = (e: React.MouseEvent) => {
    if (!fine || reduced || !wrap.current || !plate.current) return;
    const r = wrap.current.getBoundingClientRect();
    const rx = ((e.clientY - (r.top + r.height / 2)) / r.height) * -6;
    const ry = ((e.clientX - (r.left + r.width / 2)) / r.width) * 6;
    plate.current.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  };
  const onLeave = () => {
    if (plate.current) plate.current.style.transform = "perspective(1200px) rotateX(0) rotateY(0) scale(1)";
    resetCursor();
  };

  return (
    <Reveal
      as="article"
      className={wide ? "lg:col-span-7" : "lg:col-span-5"}
      y={60}
      duration={1.2}
    >
      <a
        href="#contact"
        ref={wrap as never}
        onMouseMove={onMove}
        onMouseEnter={() => setCursor({ variant: "view", label: "View" })}
        onMouseLeave={onLeave}
        className="group block"
      >
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: wide ? "16 / 10" : "4 / 5" }}
        >
          <div
            ref={plate}
            className="absolute inset-0 will-change-transform"
            style={{ transition: "transform .7s var(--ease-out-expo)" }}
          >
            <Plate kind={project.kind} tone={project.tone} seed={i + 3} index={`0${i + 1}`} label={project.discipline} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,7,6,0.5)] via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40" />
          <div className="absolute inset-0 flex items-end p-6 md:p-8">
            <span className="translate-y-3 font-mono text-[0.66rem] tracking-[0.16em] text-[var(--color-paper-100)] uppercase opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {project.year} · {project.client}
            </span>
          </div>
        </div>
        <div className="mt-6 flex items-baseline justify-between gap-6">
          <h3 className="display-l text-[var(--paper)] transition-colors duration-500 group-hover:text-[var(--accent-bright)]">
            {project.title}
          </h3>
          <span className="hidden shrink-0 font-mono text-[0.66rem] tracking-[0.16em] text-[var(--color-stone-500)] uppercase sm:block">
            {project.discipline}
          </span>
        </div>
        <p className="mt-3 max-w-[52ch] text-[0.98rem] leading-relaxed text-[var(--color-stone-300)]">
          {project.summary}
        </p>
      </a>
    </Reveal>
  );
}

export default function FeaturedWork() {
  return (
    <section id="work" className="section">
      <div className="shell">
        <div className="flex flex-col gap-4 border-t border-[color-mix(in_oklab,var(--paper)_10%,transparent)] pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">02 — Selected Work</span>
            <h2 className="display-xl mt-6 max-w-[14ch] text-[var(--paper)]">
              A gallery, <span className="italic-serif text-[var(--color-stone-300)]">not a grid.</span>
            </h2>
          </div>
          <p className="max-w-[34ch] text-[var(--color-stone-300)]">
            Each engagement occupies its own space. Massive imagery, generous silence,
            and transitions that reward attention.
          </p>
        </div>

        <div className="mt-20 grid gap-x-8 gap-y-20 lg:grid-cols-12">
          {FEATURED.map((p, i) => (
            <GalleryItem key={p.id} project={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

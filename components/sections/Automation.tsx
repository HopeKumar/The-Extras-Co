"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { AUTOMATION_NODES, AUTOMATION_EDGES } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { setCursor, resetCursor } from "@/lib/cursor";

export default function Automation() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);
  activeRef.current = active;

  useEffect(() => {
    const cnv = canvas.current!;
    const box = container.current!;
    const ctx = cnv.getContext("2d")!;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const resize = () => {
      const r = box.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cnv.width = W * dpr;
      cnv.height = H * dpr;
      cnv.style.width = `${W}px`;
      cnv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    const nodeById = Object.fromEntries(AUTOMATION_NODES.map((n) => [n.id, n]));
    const pos = (id: string) => {
      const n = nodeById[id];
      return { x: (n.x / 100) * W, y: (n.y / 100) * H };
    };

    let raf = 0;
    const render = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const act = activeRef.current;

      // edges
      AUTOMATION_EDGES.forEach(([a, b], i) => {
        const pa = pos(a);
        const pb = pos(b);
        const lit = act === a || act === b;
        ctx.strokeStyle = lit ? "rgba(216,169,120,0.55)" : "rgba(196,187,172,0.14)";
        ctx.lineWidth = lit ? 1.3 : 1;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();

        // traveling pulse
        if (!reduced) {
          const speed = 0.00016 + (i % 3) * 0.00004;
          const p = ((t * speed + i * 0.2) % 1);
          const px = pa.x + (pb.x - pa.x) * p;
          const py = pa.y + (pb.y - pa.y) * p;
          ctx.fillStyle = `rgba(216,169,120,${lit ? 0.95 : 0.6})`;
          ctx.beginPath();
          ctx.arc(px, py, lit ? 3 : 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // nodes
      AUTOMATION_NODES.forEach((n) => {
        const p = pos(n.id);
        const lit = act === n.id;
        const pulse = reduced ? 0 : Math.sin(t * 0.002 + n.x) * 1.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = lit ? "rgba(216,169,120,0.14)" : "rgba(196,187,172,0.05)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = lit ? "#d8a978" : "#c4bbac";
        ctx.fill();
      });

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced]);

  return (
    <section id="automation" className="section relative overflow-hidden">
      <div className="shell">
        <div className="border-t border-[color-mix(in_oklab,var(--paper)_10%,transparent)] pt-8">
          <span className="eyebrow">04 — AI Automation</span>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 className="display-xl max-w-[16ch] text-[var(--paper)] lg:col-span-8">
            A living system that <span className="italic-serif text-[var(--accent-bright)]">thinks</span> alongside your team.
          </h2>
          <p className="max-w-[38ch] text-[var(--color-stone-300)] lg:col-span-4">
            Not an icon grid of features. An ecosystem where signals flow, agents reason,
            work routes itself — and you stay in control of what matters.
          </p>
        </div>

        <div
          ref={container}
          className="relative mt-16 h-[62vh] min-h-[420px] w-full overflow-hidden rounded-sm border border-[color-mix(in_oklab,var(--paper)_8%,transparent)] bg-[color-mix(in_oklab,var(--ink)_60%,#000)]"
        >
          <canvas ref={canvas} className="absolute inset-0" />
          {AUTOMATION_NODES.map((n) => (
            <button
              key={n.id}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              onMouseEnter={() => {
                setActive(n.id);
                setCursor({ variant: "hover" });
              }}
              onMouseLeave={() => {
                setActive(null);
                resetCursor();
              }}
              onFocus={() => setActive(n.id)}
              onBlur={() => setActive(null)}
              aria-label={`${n.label}: ${n.detail}`}
            >
              <span className="block h-14 w-14 rounded-full" />
              <span className="pointer-events-none absolute left-1/2 top-[calc(50%+22px)] w-[180px] -translate-x-1/2 text-center">
                <span className="font-mono text-[0.64rem] tracking-[0.18em] text-[var(--paper)] uppercase">
                  {n.label}
                </span>
                <span className="mt-1 block text-[0.72rem] leading-snug text-[var(--color-stone-400)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100">
                  {n.detail}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            ["Discovery", "We map the repetitive nine-tenths of your work."],
            ["Design", "Custom agents shaped around real workflows, not demos."],
            ["Deployment", "Secure integration, human-in-the-loop, always observable."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.08} className="border-t border-[color-mix(in_oklab,var(--paper)_10%,transparent)] pt-5">
              <h3 className="font-mono text-[0.7rem] tracking-[0.16em] text-[var(--accent)] uppercase">{t}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--color-stone-300)]">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { clamp, mapRange } from "@/lib/utils";
import { renderHero } from "./heroScene";

const DRIFT = ["PRODUCTS", "BRANDS", "SYSTEMS", "AUTOMATION", "INTERFACES"];

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export default function Hero({ ready }: { ready: boolean }) {
  const section = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const cnv = canvas.current!;
    const ctx = cnv.getContext("2d", { alpha: false })!;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cnv.width = Math.floor(w * dpr);
      cnv.height = Math.floor(h * dpr);
      cnv.style.width = `${w}px`;
      cnv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const state = { target: 0, cur: 0, vel: 0 };

    const driftEls = driftRef.current
      ? Array.from(driftRef.current.querySelectorAll<HTMLElement>("[data-drift]"))
      : [];

    const updateOverlays = (p: number) => {
      // Intro (phase 1): fades out as we wake up
      const introOut = 1 - smoothstep(0.06, 0.2, p);
      if (introRef.current) {
        introRef.current.style.opacity = `${introOut}`;
        introRef.current.style.transform = `translateY(${(1 - introOut) * -30}px)`;
      }
      if (hintRef.current) hintRef.current.style.opacity = `${introOut}`;

      // Drift words (phase 3): separate depths, appear mid, leave before statement
      const driftIn = smoothstep(0.2, 0.34, p);
      const driftOut = 1 - smoothstep(0.6, 0.72, p);
      const driftOpacity = driftIn * driftOut;
      if (driftRef.current) driftRef.current.style.opacity = `${driftOpacity}`;
      driftEls.forEach((el, i) => {
        const depth = parseFloat(el.dataset.depth || "1");
        const y = (p - 0.42) * 900 * depth;
        const x = Math.sin(i * 1.7) * (p - 0.42) * 260 * depth;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      // Statement (phase 5): converges + dissolves in
      const stIn = smoothstep(0.8, 0.94, p);
      if (statementRef.current) {
        statementRef.current.style.opacity = `${stIn}`;
        statementRef.current.style.transform = `translateY(${(1 - stIn) * 40}px) scale(${mapRange(stIn, 0, 1, 1.06, 1)})`;
        const words = statementRef.current.querySelectorAll<HTMLElement>("[data-sw]");
        words.forEach((el, i) => {
          const local = clamp(smoothstep(0.8 + i * 0.012, 0.95 + i * 0.012, p));
          el.style.opacity = `${local}`;
          el.style.transform = `translateY(${(1 - local) * 100}%)`;
        });
      }
    };

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      // Ease progress toward scroll target for cinematic lag
      const prev = state.cur;
      state.cur += (state.target - state.cur) * (reduced ? 1 : 0.09);
      const instVel = (state.cur - prev) / (dt / 16.67);
      state.vel += (clamp(instVel * 6, -1, 1) - state.vel) * 0.1;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      renderHero(ctx, w, h, {
        progress: state.cur,
        px: pointer.x,
        py: pointer.y,
        velocity: state.vel,
        time: now,
      });
      updateOverlays(state.cur);
      raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      // Static, legible poster + full statement
      state.target = 0.62;
      state.cur = 0.62;
      renderHero(ctx, w, h, { progress: 0.62, px: 0, py: 0, velocity: 0, time: 0 });
      updateOverlays(1);
      if (statementRef.current) statementRef.current.style.opacity = "1";
    } else {
      raf = requestAnimationFrame(loop);
    }

    let st: ScrollTrigger | undefined;
    if (!reduced) {
      registerGsap();
      st = ScrollTrigger.create({
        trigger: section.current!,
        start: "top top",
        end: "bottom bottom",
        pin: pin.current!,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => {
          state.target = self.progress;
        },
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      st?.kill();
    };
  }, [reduced]);

  // Fade the whole hero in when the loader finishes.
  useEffect(() => {
    if (!ready || !pin.current) return;
    gsap.fromTo(
      pin.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1.4, ease: "power2.out" }
    );
  }, [ready]);

  return (
    <section
      ref={section}
      id="top"
      className="relative"
      style={{ height: reduced ? "100svh" : "560vh" }}
      aria-label="Introduction"
    >
      <div ref={pin} className="relative h-[100svh] w-full overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />

        {/* Phase 1 — awakening / minimal intro */}
        <div
          ref={introRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <span className="eyebrow mb-6 block">Creative Technology Studio</span>
          <p className="font-display text-[clamp(1.1rem,2.2vw,1.9rem)] font-light italic text-[var(--color-paper-100)]">
            Est. for the companies who refuse to be forgotten.
          </p>
        </div>

        {/* Phase 3 — drifting disciplines at different depths */}
        <div
          ref={driftRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0 }}
        >
          <div className="relative">
            {DRIFT.map((word, i) => {
              const depth = [0.4, 0.85, 1.3, 0.65, 1.1][i];
              const pos = [
                "left-[-34vw] top-[-18vh]",
                "right-[-30vw] top-[6vh]",
                "left-[-10vw] top-[22vh]",
                "right-[-20vw] top-[-26vh]",
                "left-[-40vw] top-[10vh]",
              ][i];
              return (
                <span
                  key={word}
                  data-drift
                  data-depth={depth}
                  className={`absolute font-display font-light whitespace-nowrap ${pos}`}
                  style={{
                    fontSize: `clamp(1.5rem, ${2 + depth * 3}vw, ${3 + depth * 3}rem)`,
                    color: i % 2 ? "var(--color-stone-400)" : "var(--color-paper-200)",
                    opacity: 0.5 + depth * 0.3,
                    willChange: "transform",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>

        {/* Phase 5 — converging statement (semantic H1) */}
        <div
          ref={statementRef}
          className="absolute inset-0 flex items-center justify-center px-6"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        >
          <h1 className="display-xl max-w-[16ch] text-center text-[var(--paper)]">
            {["We", "build", "digital", "experiences"].map((wd, i) => (
              <span key={i} className="inline-block overflow-hidden align-top">
                <span data-sw className="inline-block will-change-transform">
                  {wd}&nbsp;
                </span>
              </span>
            ))}
            <span className="italic-serif text-[var(--accent-bright)]">
              {["worth", "remembering."].map((wd, i) => (
                <span key={i} className="inline-block overflow-hidden align-top">
                  <span data-sw className="inline-block will-change-transform">
                    {wd}&nbsp;
                  </span>
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="font-mono text-[0.6rem] tracking-[0.28em] text-[var(--color-stone-400)] uppercase">
            Scroll to enter
          </span>
          <span className="relative block h-10 w-px overflow-hidden bg-[color-mix(in_oklab,var(--paper)_20%,transparent)]">
            <span className="scroll-nub absolute inset-x-0 top-0 h-3 bg-[var(--accent)]" />
          </span>
        </div>
      </div>

      <style>{`
        @keyframes nub { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }
        .scroll-nub { animation: nub 2.2s var(--ease-in-out-expo) infinite; }
        @media (prefers-reduced-motion: reduce) { .scroll-nub { animation: none; } }
      `}</style>
    </section>
  );
}

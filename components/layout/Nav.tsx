"use client";

import { useEffect, useRef, useState } from "react";
import { LogoLockup } from "@/components/ui/Logo";
import MagneticButton from "@/components/ui/MagneticButton";
import { NAV_LINKS } from "@/lib/data";
import { cursorProps } from "@/lib/cursor";
import { cn } from "@/lib/utils";

export default function Nav({ ready }: { ready: boolean }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastY.current && y > 600 && !open) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[500] transition-all duration-700",
          hidden ? "-translate-y-full" : "translate-y-0"
        )}
        style={{
          opacity: ready ? 1 : 0,
          transition: "transform .7s var(--ease-out-expo), opacity 1s ease .2s",
        }}
      >
        <div
          className={cn(
            "absolute inset-0 -z-10 border-b transition-all duration-700",
            scrolled
              ? "border-[color-mix(in_oklab,var(--paper)_10%,transparent)] bg-[color-mix(in_oklab,var(--ink)_72%,transparent)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
          )}
        />
        <nav className="shell flex items-center justify-between" style={{ height: "var(--nav-h)" }}>
          <LogoLockup />

          <div className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                {...cursorProps("hover")}
                className="group relative font-mono text-[0.68rem] tracking-[0.16em] text-[var(--color-stone-300)] uppercase transition-colors duration-300 hover:text-[var(--paper)]"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--accent)] transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <MagneticButton href="#contact" variant="outline" className="hidden md:inline-flex" strength={0.25}>
              Start a project
            </MagneticButton>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={cn("h-px w-6 bg-[var(--paper)] transition-all duration-[400ms]", open && "translate-y-[3px] rotate-45")} />
              <span className={cn("h-px w-6 bg-[var(--paper)] transition-all duration-[400ms]", open && "-translate-y-[3px] -rotate-45")} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={cn(
          "fixed inset-0 z-[490] flex flex-col justify-between bg-[var(--ink)] px-[var(--gutter)] pt-[calc(var(--nav-h)+2rem)] pb-12 transition-all duration-700 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-2">
          {NAV_LINKS.map((l, i) => (
            <li key={l.href} className="overflow-hidden border-b border-[color-mix(in_oklab,var(--paper)_8%,transparent)] py-3">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="display-l block text-[var(--paper)] transition-transform duration-500"
                style={{
                  transform: open ? "translateY(0)" : "translateY(120%)",
                  transitionDelay: `${0.1 + i * 0.06}s`,
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-4">
          <a href="#contact" onClick={() => setOpen(false)} className="font-mono text-xs tracking-[0.2em] text-[var(--accent)] uppercase">
            hello@theextras.co
          </a>
          <MagneticButton href="#contact" onClick={() => setOpen(false)} className="w-full">
            Start a project
          </MagneticButton>
        </div>
      </div>
    </>
  );
}

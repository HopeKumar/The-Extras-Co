"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { NAV_LINKS } from "@/lib/data";
import { cursorProps } from "@/lib/cursor";

const SOCIAL = [
  ["Instagram", "https://instagram.com"],
  ["LinkedIn", "https://linkedin.com"],
  ["Dribbble", "https://dribbble.com"],
  ["Awwwards", "https://awwwards.com"],
];

export default function Footer() {
  const [year, setYear] = useState(2026);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-[color-mix(in_oklab,var(--paper)_10%,transparent)] pt-20 pb-10">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <span className="h-9 w-9 text-[var(--paper)]">
                <LogoMark />
              </span>
              <span className="font-mono text-[0.72rem] tracking-[0.24em] text-[var(--paper)] uppercase">
                The&nbsp;Extras&nbsp;&amp;&nbsp;Co.
              </span>
            </div>
            <p className="mt-8 max-w-[34ch] text-[var(--color-stone-300)] lead">
              We build digital experiences worth remembering — products, brands, and
              intelligence for companies that refuse to be forgotten.
            </p>
            <a
              href="mailto:hello@theextras.co"
              {...cursorProps("hover")}
              className="mt-8 inline-block font-display text-[clamp(1.5rem,3vw,2.4rem)] font-light text-[var(--paper)] transition-colors hover:text-[var(--accent-bright)]"
            >
              hello@theextras.co
            </a>
          </div>

          <nav className="lg:col-span-3 lg:col-start-8" aria-label="Footer">
            <span className="font-mono text-[0.6rem] tracking-[0.2em] text-[var(--color-stone-500)] uppercase">
              Navigate
            </span>
            <ul className="mt-6 flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    {...cursorProps("hover")}
                    className="text-[var(--color-paper-100)] transition-colors hover:text-[var(--accent-bright)]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <span className="font-mono text-[0.6rem] tracking-[0.2em] text-[var(--color-stone-500)] uppercase">
              Elsewhere
            </span>
            <ul className="mt-6 flex flex-col gap-3">
              {SOCIAL.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    {...cursorProps("hover")}
                    className="text-[var(--color-paper-100)] transition-colors hover:text-[var(--accent-bright)]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div className="mt-20 overflow-hidden">
          <span className="block select-none whitespace-nowrap font-display text-[clamp(3rem,16vw,15rem)] font-light leading-[0.85] tracking-[-0.03em] text-[color-mix(in_oklab,var(--paper)_14%,transparent)]">
            Extras&nbsp;&amp;&nbsp;Co.
          </span>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[color-mix(in_oklab,var(--paper)_10%,transparent)] pt-8 text-[0.72rem] text-[var(--color-stone-500)] md:flex-row md:items-center md:justify-between">
          <span className="font-mono tracking-[0.08em]">© {year} The Extras &amp; Co. All rights reserved.</span>
          <span className="font-mono tracking-[0.08em]">Designed &amp; engineered in-house.</span>
        </div>
      </div>
    </footer>
  );
}



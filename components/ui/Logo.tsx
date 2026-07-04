import { cn } from "@/lib/utils";

/**
 * The Extras & Co. monogram — an architectural "E" bracket with an
 * ampersand node. Strokes carry `data-logo-stroke` so the loader can
 * draw them on. Purely geometric so it constructs cleanly.
 */
export function LogoMark({
  className,
  strokeClass,
}: {
  className?: string;
  strokeClass?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={cn("h-full w-full", className)} fill="none" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={strokeClass}
      >
        <path data-logo-stroke d="M74 16 L30 16 L30 84 L74 84" />
        <path data-logo-stroke d="M30 50 L60 50" />
      </g>
      <circle data-logo-node cx="76" cy="50" r="4.5" fill="var(--accent)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-mono text-[0.72rem] leading-none tracking-[0.24em] uppercase",
        className
      )}
    >
      The&nbsp;Extras&nbsp;&amp;&nbsp;Co.
    </span>
  );
}

export function LogoLockup({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("group inline-flex items-center gap-3", className)} aria-label="The Extras & Co. — home">
      <span className="h-7 w-7 text-[var(--paper)] transition-colors duration-500 group-hover:text-[var(--accent)]">
        <LogoMark />
      </span>
      <Wordmark className="hidden text-[var(--paper)] sm:inline" />
    </a>
  );
}

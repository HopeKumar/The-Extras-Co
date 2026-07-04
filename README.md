# The Extras & Co. — Flagship Site

A production-grade, award-tier marketing experience for a creative technology studio.
Editorial, architectural, cinematic — engineered for craft and performance.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** for tokens + layout, hand-authored CSS for the design language
- **GSAP + ScrollTrigger** — pinned, scrubbed scroll choreography
- **Lenis** — smooth scroll, synced to the GSAP ticker
- **Framer Motion** — available for micro-interactions
- **Canvas 2D** — the procedural, scroll-controlled hero + the AI "digital brain"

No external image assets: every visual is generated (SVG/Canvas/CSS) so there are
no placeholders and nothing to lazy-load or optimise.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

## Architecture

```
app/
  layout.tsx        fonts (Fraunces / Inter / JetBrains Mono), metadata, SEO
  page.tsx          → <Experience/>
  globals.css       design system: tokens, type scale, grain, a11y
  icon.svg          favicon (the monogram)
components/
  Experience.tsx    orchestrates loader → reveal, mounts every section
  providers/        SmoothScroll (Lenis ⇄ GSAP)
  layout/           Nav, Footer
  ui/               Cursor, MagneticButton, Reveal, AnimatedHeading, Marquee, Plate, Logo
  sections/         Loader, hero/, About, FeaturedWork, Collection, Automation,
                    CaseStudies, Process, Results, Testimonials, Pricing, Faq, Contact
lib/
  data.ts           all copy & content
  gsap.ts hooks.ts cursor.ts utils.ts
```

## The hero

`components/sections/hero/heroScene.ts` renders a "scroll-controlled film": an
architectural space that constructs itself as scroll progress moves `0 → 1`. The
camera travels through depth, a monolith assembles, nodes emerge, light sweeps,
and the sequence dissolves into the converging statement. Every frame is a pure
function of `(progress, pointer, velocity)` — the visitor controls time.

## Motion & performance

- Only `transform` / `opacity` are animated — GPU-friendly, no layout thrash.
- `devicePixelRatio` capped at 2 on canvases.
- Heavy interactions (hero pin, horizontal collection) are desktop-only via
  `gsap.matchMedia`; mobile gets elegant native fallbacks.
- Static-rendered; first-load JS ≈ 175 kB.

## Accessibility

- Full `prefers-reduced-motion` path (static hero poster, no scrubbing, instant reveals).
- Semantic landmarks, a real `<h1>`, skip link, visible focus rings.
- Custom cursor only on fine pointers; decorative canvases are `aria-hidden`.
- Keyboard-operable nav, FAQ, testimonials and automation nodes.

## Make it yours

- Copy & data: `lib/data.ts`
- Accent colour: `--accent*` in `app/globals.css` (single accent by design)
- Visual compositions: `components/ui/Plate.tsx` (`kind` + `tone` + `seed`)

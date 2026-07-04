"use client";

export type CursorVariant = "default" | "hover" | "view" | "text" | "drag";

type CursorState = { variant: CursorVariant; label?: string };

type Listener = (s: CursorState) => void;

const listeners = new Set<Listener>();
let state: CursorState = { variant: "default" };

export function setCursor(next: Partial<CursorState>) {
  state = { variant: next.variant ?? "default", label: next.label };
  listeners.forEach((l) => l(state));
}

export function resetCursor() {
  setCursor({ variant: "default" });
}

export function subscribeCursor(l: Listener) {
  listeners.add(l);
  l(state);
  return () => {
    listeners.delete(l);
  };
}

/** Convenience props to spread on any element to drive the cursor. */
export function cursorProps(variant: CursorVariant, label?: string) {
  return {
    onMouseEnter: () => setCursor({ variant, label }),
    onMouseLeave: () => resetCursor(),
  };
}

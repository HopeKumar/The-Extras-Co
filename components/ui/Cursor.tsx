"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeCursor, type CursorVariant } from "@/lib/cursor";
import { useIsDesktopPointer, usePrefersReducedMotion } from "@/lib/hooks";

export default function Cursor() {
  const fine = useIsDesktopPointer();
  const reduced = usePrefersReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState<string | undefined>();

  useEffect(() => subscribeCursor((s) => {
    setVariant(s.variant);
    setLabel(s.label);
  }), []);

  useEffect(() => {
    if (!fine || reduced) return;
    document.documentElement.classList.add("has-cursor");

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: mouse.x, y: mouse.y };
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        if (dot.current) dot.current.style.opacity = "1";
        if (ring.current) ring.current.style.opacity = "1";
      }
    };
    const onLeave = () => {
      visible = false;
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };

    const loop = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;
      if (dot.current)
        dot.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      if (ring.current)
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  const showLabel = (variant === "view" || variant === "drag") && !!label;

  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}>
      <div
        ref={dot}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: variant === "text" ? 3 : 7,
          height: variant === "text" ? 26 : 7,
          borderRadius: variant === "text" ? 2 : "50%",
          background: "var(--accent)",
          opacity: 0,
          transition: "width .3s var(--ease-out-expo), height .3s var(--ease-out-expo), opacity .3s",
          mixBlendMode: variant === "default" ? "normal" : "normal",
        }}
      />
      <div
        ref={ring}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          display: "grid",
          placeItems: "center",
          width: showLabel ? 92 : variant === "hover" ? 56 : 34,
          height: showLabel ? 92 : variant === "hover" ? 56 : 34,
          borderRadius: "50%",
          border: "1px solid color-mix(in oklab, var(--accent) 60%, transparent)",
          background: showLabel ? "var(--accent)" : "transparent",
          opacity: 0,
          transition:
            "width .4s var(--ease-out-expo), height .4s var(--ease-out-expo), background .3s, opacity .3s",
        }}
      >
        {showLabel && (
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#0a0806",
              fontWeight: 500,
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

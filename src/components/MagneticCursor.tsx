"use client";

import { useEffect, useRef } from "react";

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      trailPos.current.x += (target.current.x - trailPos.current.x) * 0.06;
      trailPos.current.y += (target.current.y - trailPos.current.y) * 0.06;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x - 3}px, ${pos.current.y - 3}px, 0)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailPos.current.x - 20}px, ${trailPos.current.y - 20}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      <div
        ref={trailRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,164,109,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate3d(-20px, -20px, 0)",
        }}
      />
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#c8a46d",
          boxShadow: "0 0 8px rgba(200,164,109,0.6), 0 0 20px rgba(200,164,109,0.3)",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate3d(0, 0, 0)",
        }}
      />
    </>
  );
}

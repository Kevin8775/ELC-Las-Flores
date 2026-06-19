"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.height = "1px";
    sentinel.style.position = "absolute";
    sentinel.style.top = "400px";
    document.body.appendChild(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const show = !entry.isIntersecting;
        setVisible(show);
        requestAnimationFrame(() => setOpacity(show ? 1 : 0));
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      document.body.removeChild(sentinel);
    };
  }, []);

  return (
    <div ref={ref} className="fixed bottom-5 left-5 z-40" style={{ opacity, transform: `scale(${visible ? 1 : 0.8})`, transition: "opacity 0.3s ease, transform 0.3s ease", pointerEvents: visible ? "auto" : "none" }}>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg shadow-slate-900/15 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-xl"
        aria-label="Volver arriba"
      >
        <ArrowUp className="h-5 w-5 text-primary" />
      </button>
    </div>
  );
}

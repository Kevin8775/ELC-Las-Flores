"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 left-5 z-40 transition-all duration-300 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
      }`}
    >
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

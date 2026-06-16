"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg shadow-slate-900/15 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-xl"
      aria-label="Volver arriba"
    >
      <ArrowUp className="h-5 w-5 text-[#1E3A5F]" />
    </button>
  );
}

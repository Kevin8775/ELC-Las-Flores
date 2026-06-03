"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  { src: "/Image1.jpeg", alt: "Estudiantes de ELC Las Flores" },
  { src: "/Image2.jpeg", alt: "Actividad académica ELC Las Flores" },
  { src: "/Image3.jpeg", alt: "Ambiente del centro educativo" },
];

export function LandingCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-4">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="relative aspect-[16/8] w-full overflow-hidden bg-slate-950/5">
          <div
            className="flex h-full w-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.src} className="relative h-full min-w-full">
                <Image src={slide.src} alt={slide.alt} fill className="object-contain" priority={slide.src === slides[0].src} />
              </div>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/40 to-transparent p-4">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Ir a la imagen ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-2.5 bg-white/50"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

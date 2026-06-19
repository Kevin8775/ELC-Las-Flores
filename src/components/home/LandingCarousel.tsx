"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { src: "/Image1.webp", alt: "Estudiantes de ELC Las Flores en actividades académicas" },
  { src: "/Image2.webp", alt: "Actividad académica en ELC Las Flores" },
  { src: "/Image3.webp", alt: "Ambiente del centro educativo ELC Las Flores" },
];

export function LandingCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    intervalRef.current = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4500);
  };

  useEffect(() => {
    if (!paused) {
      startTimer();
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [paused]);

  const goTo = (i: number) => {
    setIndex(i);
    if (!paused) {
      startTimer();
    }
  };

  const prev = () => goTo((index - 1 + slides.length) % slides.length);
  const next = () => goTo((index + 1) % slides.length);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
  };

  return (
    <section
      className="mx-auto max-w-6xl px-4 pt-8 pb-4 md:pt-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Galería de imágenes institucionales"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="relative aspect-[16/8] w-full overflow-hidden bg-slate-950/5">
          <div
            className="flex h-full w-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div
                key={slide.src}
                className="relative h-full min-w-full"
                role="group"
                aria-roledescription="slide"
                aria-label={`Imagen ${i + 1} de ${slides.length}`}
                aria-hidden={i !== index}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/50 group-hover:opacity-100"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/50 group-hover:opacity-100"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/40 to-transparent p-4">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Ir a la imagen ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/70"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

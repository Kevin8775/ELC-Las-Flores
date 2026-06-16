"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  { src: "/Image1.jpeg", alt: "Estudiantes de ELC Las Flores en actividades académicas" },
  { src: "/Image2.jpeg", alt: "Actividad académica en ELC Las Flores" },
  { src: "/Image3.jpeg", alt: "Ambiente del centro educativo ELC Las Flores" },
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goTo((index - 1 + slides.length) % slides.length);
    } else if (e.key === "ArrowRight") {
      goTo((index + 1) % slides.length);
    }
  };

  return (
    <section
      className="mx-auto max-w-6xl px-4 pb-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
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
                  className="object-contain"
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </div>
            ))}
          </div>

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

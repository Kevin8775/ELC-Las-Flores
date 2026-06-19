"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { src: "/Image1.webp", alt: "Estudiantes de ELC Las Flores en actividades académicas" },
  { src: "/Image2.webp", alt: "Actividad académica en ELC Las Flores" },
  { src: "/Image3.webp", alt: "Ambiente del centro educativo ELC Las Flores" },
];

const AUTO_INTERVAL = 4500;
const SWIPE_THRESHOLD = 50;

export function LandingCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const total = slides.length;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, AUTO_INTERVAL);
  }, [clearTimer, total]);

  useEffect(() => {
    if (!paused) startTimer();
    else clearTimer();
    return clearTimer;
  }, [paused, startTimer, clearTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setActiveIndex((prev) => (prev - 1 + total) % total);
      else if (e.key === "ArrowRight") setActiveIndex((prev) => (prev + 1) % total);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total]);

  const goTo = (i: number) => {
    setActiveIndex(i);
    if (!paused) startTimer();
  };

  const prev = () => goTo((activeIndex - 1 + total) % total);
  const next = () => goTo((activeIndex + 1) % total);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    setTouchDeltaX(e.touches[0].clientX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchDeltaX > SWIPE_THRESHOLD) prev();
    else if (touchDeltaX < -SWIPE_THRESHOLD) next();
    setIsSwiping(false);
    setTouchDeltaX(0);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 pb-4 md:pt-12">
      <div
        className="group relative mx-auto max-w-6xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Galería de imágenes institucionales"
      >
        {/* Blurred background */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <Image
            src={slides[activeIndex].src}
            alt=""
            fill
            className="scale-125 object-cover opacity-20 blur-2xl transition-all duration-700"
            aria-hidden
            sizes="100vw"
          />
        </div>

        {/* Coverflow container */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white/5 backdrop-blur-sm" style={{ perspective: "1200px" }}>
          <div className="relative flex items-center justify-center" style={{ height: "clamp(220px, 40vw, 420px)" }}>
            {slides.map((slide, i) => {
              const offset = i - activeIndex;
              const absOffset = Math.abs(offset);
              const sign = offset > 0 ? 1 : offset < 0 ? -1 : 0;
              const isActive = offset === 0;
              const isVisible = absOffset <= 2;

              if (!isVisible) return null;

              return (
                <div
                  key={slide.src}
                  className="coverflow-card absolute left-1/2 top-1/2"
                  style={{
                    width: "clamp(180px, 35vw, 420px)",
                    aspectRatio: "16/10",
                    transform: `
                      translate(calc(-50% + ${offset * 45}%), -50%)
                      scale(${1 - absOffset * 0.2})
                      rotateY(${sign * 20}deg)
                    `,
                    opacity: 1 - absOffset * 0.35,
                    zIndex: 10 - absOffset,
                    filter: isActive ? "none" : "blur(1.5px)",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Imagen ${i + 1} de ${total}`}
                  aria-hidden={!isActive}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className={`rounded-2xl object-cover shadow-2xl transition-shadow duration-500 ${
                      isActive ? "shadow-slate-900/20" : "shadow-slate-900/10"
                    }`}
                    priority={i === 0}
                    sizes="(max-width: 768px) 55vw, (max-width: 1200px) 35vw, 420px"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-lg shadow-slate-900/10 opacity-0 backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl group-hover:opacity-100"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-lg shadow-slate-900/10 opacity-0 backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl group-hover:opacity-100"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dot indicators */}
        <div className="relative z-20 mt-4 flex items-center justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Ir a la imagen ${i + 1}`}
              aria-current={i === activeIndex ? "true" : undefined}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-8 bg-primary" : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

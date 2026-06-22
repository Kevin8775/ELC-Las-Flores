"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";

const fallbackSlides = [
  ...Array.from({ length: 38 }, (_, i) => ({
    src: `/carousel-${i + 1}.webp`,
    alt: `ELC Las Flores - imagen ${i + 1}`,
  })),
  { src: "/elcimage1.webp", alt: "ELC Las Flores - imagen institucional 1" },
  { src: "/elcimage2.webp", alt: "ELC Las Flores - imagen institucional 2" },
];

type SlideData = {
  id: string;
  src: string;
  alt: string | null;
};

const AUTO_INTERVAL = 4500;
const SWIPE_THRESHOLD = 50;

export function LandingCarousel() {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    api<{ slides: SlideData[] }>("/slides")
      .then((data) => {
        if (data.slides.length > 0) setSlides(data.slides);
        else setSlides(fallbackSlides.map((s, i) => ({ id: `fb-${i}`, src: s.src, alt: s.alt })));
      })
      .catch(() => {
        setSlides(fallbackSlides.map((s, i) => ({ id: `fb-${i}`, src: s.src, alt: s.alt })));
      });
  }, []);

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
    if (!paused && total > 0) startTimer();
    else clearTimer();
    return clearTimer;
  }, [paused, startTimer, clearTimer, total]);

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

  if (slides.length === 0) return null;

  return (
    <section className="relative pt-8 pb-4 md:pt-12">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={slides[activeIndex]?.src || fallbackSlides[0].src}
          alt=""
          fill
          className="scale-125 object-cover opacity-15 blur-3xl transition-all duration-700"
          aria-hidden
          sizes="100vw"
        />
      </div>

      <div
        className="group relative px-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Galería de imágenes institucionales"
      >
        <div className="relative" style={{ perspective: "1200px" }}>
          <div
            className="relative flex items-center justify-center"
            style={{ height: "clamp(280px, 50vw, 580px)" }}
          >
            {slides.map((slide, i) => {
              const offset = i - activeIndex;
              const absOffset = Math.abs(offset);
              const sign = offset > 0 ? 1 : offset < 0 ? -1 : 0;
              const isActive = offset === 0;
              const isVisible = absOffset <= 2;

              if (!isVisible) return null;

              return (
                <div
                  key={slide.id}
                  className="coverflow-card absolute left-1/2 top-1/2"
                  style={{
                    width: "clamp(260px, 75vw, 900px)",
                    aspectRatio: "16/10",
                    transform: `
                      translate(calc(-50% + ${offset * 18}%), -50%)
                      scale(${1 - absOffset * 0.15})
                      rotateY(${sign * 25}deg)
                    `,
                    opacity: 1 - absOffset * 0.3,
                    zIndex: 10 - absOffset,
                    filter: isActive ? "none" : "blur(1px)",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Imagen ${i + 1} de ${total}`}
                  aria-hidden={!isActive}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt || ""}
                    fill
                    className={`rounded-3xl object-cover transition-shadow duration-500 ${
                      isActive
                        ? "shadow-2xl shadow-slate-900/25"
                        : "shadow-xl shadow-slate-900/10"
                    }`}
                    priority={i === 0}
                    sizes="(max-width: 768px) 75vw, 900px"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={prev}
          className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-lg shadow-slate-900/10 opacity-0 backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl group-hover:opacity-100"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-lg shadow-slate-900/10 opacity-0 backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl group-hover:opacity-100"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="relative z-20 mt-6 flex items-center justify-center gap-2.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Ir a la imagen ${i + 1}`}
              aria-current={i === activeIndex ? "true" : undefined}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-9 bg-primary" : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

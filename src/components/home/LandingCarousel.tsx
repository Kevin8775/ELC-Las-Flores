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

const AUTO_INTERVAL = 5000;
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
    const fallback = fallbackSlides.map((s, i) => ({ id: `fb-${i}`, src: s.src, alt: s.alt }));
    api<{ slides: SlideData[] }>("/slides")
      .then((data) => {
        setSlides(data.slides.length > 0 ? [...fallback, ...data.slides] : fallback);
      })
      .catch(() => {
        setSlides(fallback);
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
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(50vh, 75vh, 100vh)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Galería de imágenes institucionales"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
          role="group"
          aria-roledescription="slide"
          aria-label={`Imagen ${i + 1} de ${total}`}
          aria-hidden={i !== activeIndex}
        >
          <Image
            src={slide.src}
            alt={slide.alt || ""}
            fill
            className="object-contain"
            priority={i <= 1}
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/50 group-hover:opacity-100 sm:left-5 sm:h-12 sm:w-12"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/50 group-hover:opacity-100 sm:right-5 sm:h-12 sm:w-12"
        aria-label="Imagen siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Ir a la imagen ${i + 1}`}
            aria-current={i === activeIndex ? "true" : undefined}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "h-2.5 w-8 bg-white"
                : "h-2 w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

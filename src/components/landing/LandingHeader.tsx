"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "50578421018";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("¡Hola! Me gustaría obtener más información sobre ELC Las Flores.")}`;

const navLinks = [
  { href: "#noticias", label: "Noticias" },
  { href: "#sobre", label: "Sobre nosotros" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#contacto", label: "Contacto" },
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b border-white/60 bg-white/75 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-slate-900/5" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="/" className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-900/10">
            <Image src="/LogoELCLFM.webp" alt="ELC Las Flores" width={56} height={56} className="h-full w-full object-contain p-0.5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">The English Language Center</p>
            <p className="text-sm font-semibold text-primary">Las Flores - Masaya</p>
          </div>
        </a>

        <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} className="transition hover:text-primary" href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-whatsapp/20 transition hover:-translate-y-0.5 hover:bg-whatsapp-dark md:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            Contactar
          </a>
          <button
            type="button"
            className="flex items-center justify-center rounded-full p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <div
        className={`overflow-hidden border-t border-slate-200 bg-white md:hidden transition-all duration-300 ease-out ${
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <div className="flex flex-col gap-4 px-4 py-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition hover:text-primary"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-whatsapp-dark"
            onClick={() => setOpen(false)}
          >
            <MessageCircle className="h-4 w-4" />
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "50578421018";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("¡Hola! Me gustaría obtener más información sobre ELC Las Flores.")}`;

const navLinks = [
  { href: "#noticias", label: "Noticias" },
  { href: "#sobre", label: "Sobre nosotros" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#horarios", label: "Horarios" },
  { href: "#contacto", label: "Contacto" },
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="/" className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-900/10">
            <Image src="/LogoELCLFM.png" alt="ELC Las Flores" width={56} height={56} className="h-full w-full object-contain p-0.5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">The English Language Center</p>
            <p className="text-sm font-semibold text-[#1E3A5F]">Las Flores - Masaya</p>
          </div>
        </a>

        <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} className="transition hover:text-[#1E3A5F]" href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/20 transition hover:-translate-y-0.5 hover:bg-[#20bd5a] md:inline-flex"
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

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-700 transition hover:text-[#1E3A5F]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20bd5a]"
              onClick={() => setOpen(false)}
            >
              <MessageCircle className="h-4 w-4" />
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

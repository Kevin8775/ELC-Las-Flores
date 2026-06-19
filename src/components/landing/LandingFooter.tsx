import Image from "next/image";
import { FacebookIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md shadow-slate-900/8 ring-1 ring-slate-100">
                <Image src="/LogoELCLFM.webp" alt="ELC Las Flores" width={48} height={48} className="h-full w-full object-contain p-0.5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">ELC</p>
                <p className="text-sm font-semibold text-primary">Las Flores</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              Centro de enseñanza del idioma inglés con modalidad sabatina en Las Flores, Masaya, Nicaragua.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Enlaces</p>
            <ul className="mt-4 space-y-3">
              {[
                { href: "#sobre", label: "Sobre nosotros" },
                { href: "#testimonios", label: "Testimonios" },
                { href: "#noticias", label: "Noticias" },
                { href: "#faq", label: "Preguntas frecuentes" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-slate-500 transition hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Síguenos</p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=100063896447056"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 ring-1 ring-slate-100 transition hover:bg-[#1877f2]/10 hover:text-[#1877f2] hover:ring-[#1877f2]/20"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://vm.tiktok.com/ZS9jmxdV4nxRF-KNxhM/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 ring-1 ring-slate-100 transition hover:bg-black/5 hover:text-black hover:ring-black/15"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://wa.me/50578421018"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 ring-1 ring-slate-100 transition hover:bg-whatsapp/10 hover:text-whatsapp hover:ring-whatsapp/20"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-8 text-center">
          <p className="text-sm font-semibold text-primary">The English Language Center - Las Flores - Masaya</p>
          <p className="mt-1.5 text-xs text-slate-400">{new Date().getFullYear()} ELC Las Flores. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

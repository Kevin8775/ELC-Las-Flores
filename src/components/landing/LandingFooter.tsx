import Image from "next/image";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md shadow-slate-900/10">
                <Image src="/LogoELCLF.png" alt="ELC Las Flores" width={48} height={48} className="h-full w-full object-contain p-0.5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">ELC</p>
                <p className="text-sm font-semibold text-[#1E3A5F]">Las Flores</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Centro de enseñanza del idioma inglés con modalidad sabatina en Las Flores, Masaya, Nicaragua.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Enlaces</p>
            <ul className="mt-4 space-y-3">
              {[
                { href: "#sobre", label: "Sobre nosotros" },
                { href: "#testimonios", label: "Testimonios" },
                { href: "#noticias", label: "Noticias" },
                { href: "#faq", label: "Preguntas frecuentes" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-slate-600 transition hover:text-[#1E3A5F]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Redes sociales</p>
            <ul className="mt-4 space-y-3">
              {[
                { href: "https://www.facebook.com/profile.php?id=100063896447056", label: "Facebook" },
                { href: "https://www.tiktok.com/@elclasflores", label: "TikTok" },
                { href: "https://wa.me/50578421018", label: "WhatsApp" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 transition hover:text-[#1E3A5F]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center">
          <p className="text-sm font-semibold text-[#1E3A5F]">The English Language Center - Las Flores - Masaya</p>
          <p className="mt-1 text-xs text-slate-500">{new Date().getFullYear()} ELC Las Flores. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

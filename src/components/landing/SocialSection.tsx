import { FacebookIcon, TikTokIcon } from "@/components/icons";

const socialLinks = [
  { icon: FacebookIcon, href: "https://www.facebook.com/profile.php?id=100063896447056", label: "Facebook", hoverBg: "hover:bg-[#1877f2]/15", hoverText: "hover:text-[#1877f2]" },
  { icon: TikTokIcon, href: "https://vm.tiktok.com/ZS9jmxdV4nxRF-KNxhM/", label: "TikTok", hoverBg: "hover:bg-black/10", hoverText: "hover:text-black" },
];

export function SocialSection() {
  return (
    <section className="bg-primary py-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60" data-aos="fade-up">
          Redes sociales
        </p>
        <h2 className="mt-3 font-serif text-3xl font-black text-white md:text-4xl" data-aos="fade-up" data-aos-delay="100">
          Conéctate con nosotros
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/70" data-aos="fade-up" data-aos-delay="150">
          Síguenos en nuestras redes sociales para estar al tanto de eventos, comunicados y contenido educativo.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition ${link.hoverBg} ${link.hoverText} hover:-translate-y-0.5`}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

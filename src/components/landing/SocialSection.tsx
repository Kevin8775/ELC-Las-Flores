import { FacebookIcon, TikTokIcon } from "@/components/icons";

const socialLinks = [
  { icon: FacebookIcon, href: "https://www.facebook.com/profile.php?id=100063896447056", label: "Facebook", hoverBg: "hover:bg-[#1877f2]/15", hoverText: "hover:text-[#1877f2]" },
  { icon: TikTokIcon, href: "https://vm.tiktok.com/ZS9jmxdV4nxRF-KNxhM/", label: "TikTok", hoverBg: "hover:bg-white/15", hoverText: "hover:text-white" },
];

export function SocialSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-20">
      <div className="absolute left-1/4 top-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute right-1/4 bottom-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute left-10 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute bottom-0 right-10 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
      <div className="elc-dots-pattern absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/50" data-aos="fade-up">
          Redes sociales
        </p>
        <h2 className="mt-3 font-serif text-3xl font-black text-white md:text-4xl" data-aos="fade-up" data-aos-delay="100">
          Conéctate con nosotros
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/55" data-aos="fade-up" data-aos-delay="150">
          Forma parte de nuestra comunidad y descubre contenido que impulsa tu aprendizaje.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition ${link.hoverBg} ${link.hoverText} hover:-translate-y-0.5 hover:shadow-xl`}
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

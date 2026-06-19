import { AOSInit } from "@/components/landing/AOSInit";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { NewsSection } from "@/components/landing/NewsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { SocialSection } from "@/components/landing/SocialSection";
import { FooterContactSection } from "@/components/landing/FooterContactSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { BackToTop } from "@/components/landing/BackToTop";
import { LandingCarousel } from "@/components/home/LandingCarousel";
import { WaveDivider } from "@/components/landing/WaveDivider";

export default function Home() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef4fb_100%)] text-slate-900">
      <AOSInit />
      <LandingHeader />
      <main>
        <HeroSection />
        <WaveDivider fill="#ffffff" />
        <LandingCarousel />
        <WaveDivider fill="#f0f6ff" flip />
        <AboutSection />
        <FeaturesSection />
        <TestimonialsSection />
        <NewsSection />
        <FaqSection />
        <SocialSection />
        <FooterContactSection />
      </main>
      <LandingFooter />
      <BackToTop />
    </div>
  );
}

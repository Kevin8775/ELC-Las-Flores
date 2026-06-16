import type { Metadata } from "next";
import { Lato, Merriweather } from "next/font/google";
import Providers from "./providers";
import { AOSInit } from "@/components/landing/AOSInit";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "ELC Las Flores - Centro de Inglés Sabatino | Las Flores, Masaya",
  description:
    "ELC Las Flores ofrece clases de inglés en modalidad sabatina para niños, jóvenes y adultos. Gestión escolar moderna, pagos en línea y comunicación institucional en Las Flores, Masaya, Nicaragua.",
  keywords: ["inglés", "clases de inglés", "Las Flores", "Masaya", "curso de inglés", "inglés sabatino", "ELC", "centro de inglés"],
  icons: {
    icon: "/LogoELCLF.png",
  },
  openGraph: {
    title: "ELC Las Flores - Centro de Inglés Sabatino",
    description:
      "Formación académica en inglés con modalidad sabatina para niños, jóvenes y adultos en Las Flores, Masaya.",
    locale: "es_NI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${lato.variable} ${merriweather.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "ELC Las Flores - The English Language Center",
              description: "Centro de enseñanza del idioma inglés con modalidad sabatina.",
              url: "https://elclasflores.edu.ni",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Las Flores",
                addressRegion: "Masaya",
                addressCountry: "NI",
              },
              teaches: "Inglés",
              foundingDate: "2024",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AOSInit />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

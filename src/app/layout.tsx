import type { Metadata } from "next";
import { Lato, Merriweather } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elclasflores.netlify.app"),
  title: "ELC Las Flores - Centro de Inglés Sabatino | Las Flores, Masaya",
  description:
    "ELC Las Flores ofrece clases de inglés en modalidad sabatina para niños, jóvenes y adultos. Gestión escolar moderna, pagos en línea y comunicación institucional en Las Flores, Masaya, Nicaragua.",
  keywords: [
    "inglés", "clases de inglés", "Las Flores", "Masaya", "curso de inglés",
    "inglés sabatino", "ELC", "centro de inglés", "Nicaragua", "inglés niños",
    "inglés adultos", "clases sabatinas",
  ],
  alternates: {
    canonical: "https://elclasflores.netlify.app",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/LogoELCLFM.webp",
  },
  openGraph: {
    title: "ELC Las Flores - Centro de Inglés Sabatino | Las Flores, Masaya",
    description:
      "Formación académica en inglés con modalidad sabatina para niños, jóvenes y adultos en Las Flores, Masaya, Nicaragua.",
    url: "https://elclasflores.netlify.app",
    siteName: "ELC Las Flores",
    locale: "es_NI",
    type: "website",
    images: [
      {
        url: "/LogoELCLFM.webp",
        width: 512,
        height: 512,
        alt: "ELC Las Flores - Centro de Inglés Sabatino",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ELC Las Flores - Centro de Inglés Sabatino",
    description:
      "Formación académica en inglés con modalidad sabatina para niños, jóvenes y adultos en Las Flores, Masaya, Nicaragua.",
    images: ["/LogoELCLFM.webp"],
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
              description: "Centro de enseñanza del idioma inglés con modalidad sabatina para niños, jóvenes y adultos en Las Flores, Masaya, Nicaragua.",
              url: "https://elclasflores.netlify.app",
              telephone: "+50578421018",
              email: "contacto@elclasflores.edu.ni",
              logo: "https://elclasflores.netlify.app/LogoELCLFM.webp",
              image: "https://elclasflores.netlify.app/LogoELCLFM.webp",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Las Flores",
                addressLocality: "Masaya",
                addressRegion: "Masaya",
                addressCountry: "NI",
              },
              areaServed: {
                "@type": "City",
                name: "Las Flores, Masaya",
              },
              sameAs: [
                "https://www.facebook.com/profile.php?id=100063896447056",
                "https://vm.tiktok.com/ZS9jmxdV4nxRF-KNxhM/",
              ],
              teaches: "Inglés",
              foundingDate: "2024",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

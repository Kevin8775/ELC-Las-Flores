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
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "ELC Las Flores - Sistema de Gestión Escolar",
  description:
    "Sistema integral para gestión académica, pagos y reportes de The English Language Center - Las Flores - Masaya.",
  icons: {
    icon: "/LogoELCLF.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${lato.variable} ${merriweather.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

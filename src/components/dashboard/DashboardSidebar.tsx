"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { BarChart3, BookOpenText, ChevronLeft, ChevronRight, CreditCard, GraduationCap, LayoutDashboard, Megaphone, Settings2, Users2 } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/estudiantes", label: "Estudiantes", icon: Users2 },
  { href: "/docentes", label: "Docentes", icon: GraduationCap },
  { href: "/grupos", label: "Grupos", icon: BookOpenText },
  { href: "/pagos", label: "Pagos", icon: CreditCard },
  { href: "/noticias", label: "Noticias", icon: Megaphone },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/configuracion", label: "Configuracion", icon: Settings2 },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 h-screen border-r border-white/10 bg-[linear-gradient(180deg,#13273f_0%,#1E3A5F_100%)] text-white shadow-2xl shadow-slate-950/10 transition-all duration-300 ${collapsed ? "w-20 px-3 py-4" : "w-72 px-5 py-6"}`}
    >
      <div className="flex h-full flex-col">
        <div className="space-y-4">
          <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : "justify-between"}`}>
            <Link href="/dashboard" className={`flex min-w-0 items-center gap-3 ${collapsed ? "justify-center p-1" : "p-2"}`}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/95 shadow-sm">
                <Image src="/LogoELCLF.png" alt="ELC Las Flores" width={48} height={48} className="h-full w-full object-contain p-0.5" />
              </span>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-[0.12em] text-white">Admin panel</p>
                  <h2 className="truncate font-serif text-lg font-bold">Las Flores</h2>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 ${collapsed ? "ml-0" : "shrink-0"}`}
              aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex-1">
          <nav className="mt-8 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-white/85 transition hover:bg-white/10 hover:text-white ${collapsed ? "justify-center px-0" : ""}`}
                  title={collapsed ? link.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0 text-[#F4C430]" />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {!collapsed && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Control central</p>
            <p className="mt-2 text-sm leading-6 text-white/70">Gestiona estudiantes, pagos, noticias y reportes desde un solo lugar.</p>
          </div>
        )}
      </div>
    </aside>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, User2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function DashboardHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const initials = user?.nombre
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleLabel = user?.role ? user.role.replace("_", " ") : "";

  return (
    <header className="sticky top-0 z-20 mb-6 border-b border-white/10 bg-[linear-gradient(180deg,#13273f_0%,#1E3A5F_100%)] px-4 py-3 text-white shadow-lg shadow-slate-950/10 backdrop-blur-xl md:px-6">
      <div className="relative flex items-center justify-between gap-3" ref={menuRef}>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4C430] text-sm font-bold text-[#1E3A5F]">
            {initials || <User2 className="h-5 w-5" />}
          </span>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-white">{user?.nombre ?? "Usuario"}</p>
            <p className="text-xs text-white/70">{roleLabel || "ADMIN"}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-white/70" />
        </button>

        {open && (
          <div className="absolute right-4 top-16 w-72 rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#13273f_0%,#1E3A5F_100%)] p-4 text-white shadow-2xl shadow-slate-950/20 md:right-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4C430] text-sm font-bold text-[#1E3A5F]">
                {initials || <User2 className="h-5 w-5" />}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{user?.nombre ?? "Usuario"}</p>
                <p className="truncate text-sm text-white/70">{user?.email ?? ""}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">{roleLabel || "ADMIN"}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 text-[#F4C430]" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

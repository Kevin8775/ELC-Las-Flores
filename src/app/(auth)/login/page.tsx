"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(
        emailRef.current?.value ?? "",
        passwordRef.current?.value ?? ""
      );
      router.push("/dashboard");
    } catch {
      setError("Credenciales invalidas. Verifica tu correo y contrasena.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-100 p-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
            <Image src="/LogoELCLFM.webp" alt="ELC Las Flores" width={80} height={80} className="h-full w-full object-contain p-1" />
          </div>
          <p className="text-sm font-semibold text-[#2E5587]">ELC Las Flores</p>
          <h1 className="mt-2 font-serif text-2xl font-bold text-[#1E3A5F]">Iniciar sesion</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            Correo electronico
            <input ref={emailRef} type="email" className="mt-1 w-full rounded-md border border-slate-300 p-2" placeholder="admin@elc.edu.ni" required />
          </label>
          <label className="block text-sm">
            Contrasena
            <input ref={passwordRef} type="password" className="mt-1 w-full rounded-md border border-slate-300 p-2" placeholder="********" required />
          </label>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" />
            Recordarme
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-md bg-[#1E3A5F] py-2 font-semibold text-white disabled:opacity-50">
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <p className="text-center text-sm">
            <Link href="/" className="text-[#2E5587] underline">
              Volver a la pagina principal
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

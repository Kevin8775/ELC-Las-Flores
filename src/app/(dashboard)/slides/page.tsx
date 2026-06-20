"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { api, apiUpload } from "@/lib/api";
import { Loader2, Plus, Trash2, X } from "lucide-react";

type Slide = {
  id: string;
  src: string;
  alt: string | null;
  orden: number;
};

export default function SlidesAdminPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api<{ slides: Slide[] }>("/slides")
      .then((data) => setSlides(data.slides))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("imagen", file);
      if (alt.trim()) fd.append("alt", alt.trim());
      await apiUpload("/slides", fd);
      setFile(null);
      setAlt("");
      setPreview(null);
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar este slide?")) return;
    await api(`/slides/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <main>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Carrusel</h1>
          <p className="mt-1 text-sm text-slate-500">Administra las imágenes del carrusel principal</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A5F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2E5587]"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancelar" : "Agregar imagen"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="elc-card mt-6 p-6">
          <h2 className="text-lg font-bold text-[#1E3A5F]">Nueva imagen</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 file:mr-4 file:rounded-lg file:border-0 file:bg-[#1E3A5F] file:px-3 file:py-1 file:text-sm file:text-white file:font-semibold hover:file:bg-[#2E5587]"
              />
            </div>
            {preview && (
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
            )}
            <input
              type="text"
              placeholder="Texto alternativo (opcional)"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10"
            />
            <button
              type="submit"
              disabled={saving || !file}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A5F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2E5587] disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Subiendo..." : "Subir imagen"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#1E3A5F]" />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slides.length === 0 && (
            <div className="elc-card col-span-full p-8 text-center">
              <p className="text-sm text-slate-500">No hay imágenes en el carrusel. Agrega la primera.</p>
            </div>
          )}
          {slides.map((slide) => (
            <div key={slide.id} className="elc-card overflow-hidden">
              <div className="relative aspect-video">
                <Image src={slide.src} alt={slide.alt || ""} fill className="object-cover" />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{slide.alt || "Sin descripción"}</p>
                  <p className="text-xs text-slate-400">Orden: {slide.orden}</p>
                </div>
                <button
                  type="button"
                  onClick={() => eliminar(slide.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 transition hover:bg-red-200"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { api, apiUpload } from "@/lib/api";
import { Loader2, Megaphone, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type NoticiaImagen = {
  id: string;
  url: string;
  alt: string | null;
  orden: number;
};

type Noticia = {
  id: string;
  titulo: string;
  contenido: string;
  categoria: string;
  publicado: boolean;
  createdAt: string;
  imagenes: NoticiaImagen[];
};

const CATEGORIAS = [
  { value: "NOTICIA", label: "Noticia" },
  { value: "EVENTO", label: "Evento" },
  { value: "COMUNICADO", label: "Comunicado" },
  { value: "LOGRO", label: "Logro" },
];

export default function NoticiasAdminPage() {
  const [items, setItems] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("NOTICIA");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api<{ noticias: Noticia[] }>("/noticias")
      .then((data) => setItems(data.noticias))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !contenido.trim()) {
      toast.warning("Titulo y contenido son obligatorios");
      return;
    }
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("titulo", titulo.trim());
      fd.append("contenido", contenido.trim());
      fd.append("categoria", categoria);
      files.forEach((f) => fd.append("imagenes", f));

      await apiUpload("/noticias", fd);
      setTitulo("");
      setContenido("");
      setCategoria("NOTICIA");
      setFiles([]);
      setPreviews([]);
      setShowForm(false);
      load();
      toast.success("Noticia publicada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al publicar noticia");
    } finally {
      setSaving(false);
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar esta noticia?")) return;
    try {
      await api(`/noticias/${id}`, { method: "DELETE" });
      load();
      toast.success("Noticia eliminada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar noticia");
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("es-NI", { year: "numeric", month: "short", day: "numeric" });
    } catch { return d; }
  };

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Noticias</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A5F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2E5587]"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancelar" : "Crear noticia"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="elc-card mt-6 p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#1E3A5F]">
            <Pencil className="h-5 w-5" /> Nueva noticia
          </h2>
          <div className="mt-5 space-y-4">
            <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10"
            />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10"
            >
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <textarea
              placeholder="Contenido"
              rows={6}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              required
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Imágenes (opcional, máx. 10)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10 file:mr-4 file:rounded-lg file:border-0 file:bg-[#1E3A5F] file:px-3 file:py-1 file:text-sm file:text-white file:font-semibold hover:file:bg-[#2E5587]"
              />
            </div>
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {previews.map((p, i) => (
                  <div key={i} className="relative aspect-video overflow-hidden rounded-xl">
                    <Image src={p} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A5F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2E5587] disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Publicando..." : "Publicar noticia"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#1E3A5F]" />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.length === 0 && (
            <div className="elc-card p-8 text-center">
              <Megaphone className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No hay noticias aún. Crea la primera.</p>
            </div>
          )}
          {items.map((n) => (
            <div key={n.id} className="elc-card flex items-start justify-between gap-4 p-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#2E5587]">
                    {CATEGORIAS.find((c) => c.value === n.categoria)?.label ?? n.categoria}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(n.createdAt)}</span>
                  {n.imagenes.length > 0 && (
                    <span className="text-xs text-slate-400">({n.imagenes.length} fotos)</span>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{n.titulo}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{n.contenido}</p>
                {n.imagenes.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {n.imagenes.map((img) => (
                      <div key={img.id} className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                        <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => eliminar(n.id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 transition hover:bg-red-200"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

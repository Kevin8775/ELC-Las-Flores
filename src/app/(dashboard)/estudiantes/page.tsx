"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Estudiante {
  id: string;
  numeroMatricula: string;
  nombre: string;
  fechaNacimiento: string;
  genero: string;
  correoElectronico?: string;
  telefono?: string;
  direccion: string;
  nivel: string;
  turno: string;
  estado: string;
  tutorNombre: string;
  tutorParentesco: string;
  tutorCorreo?: string;
  tutorTelefono: string;
  tutorDireccion?: string;
}

interface GrupoDisponible {
  id: string;
  nivel: string;
  turno: string;
  docente?: { id: string; nombre: string; email: string } | null;
  estudianteCount: number;
}

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [grupos, setGrupos] = useState<GrupoDisponible[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formNivel, setFormNivel] = useState("");
  const [formTurno, setFormTurno] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const formDirty = useRef(false);
  const editingEstudiante = estudiantes.find((e) => e.id === editingId) ?? null;

  useEffect(() => {
    Promise.all([
      api<{ estudiantes: Estudiante[] }>("/estudiantes"),
      api<{ grupos: GrupoDisponible[] }>("/grupos"),
    ])
      .then(([estudiantesData, gruposData]) => {
        setEstudiantes(estudiantesData.estudiantes);
        setGrupos(gruposData.grupos);
      })
      .catch(() => toast.error("Error al cargar estudiantes"))
      .finally(() => setLoading(false));
  }, []);

  const grupoSeleccionado = useMemo(() => {
    if (!formNivel || !formTurno) return null;
    return grupos.find((grupo) => grupo.nivel === formNivel && grupo.turno === formTurno) ?? null;
  }, [formNivel, formTurno, grupos]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = new FormData(e.target as HTMLFormElement);
      const data = await api<{ estudiante: Estudiante }>("/estudiantes", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(form)),
      });
      setEstudiantes((prev) => [...prev, data.estudiante]);
      toast.success("Estudiante creado");
      closeForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear estudiante");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(e: FormEvent, id: string) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = new FormData(e.target as HTMLFormElement);
      const data = await api<{ estudiante: Estudiante }>(`/estudiantes/${id}`, {
        method: "PUT",
        body: JSON.stringify(Object.fromEntries(form)),
      });
      setEstudiantes((prev) => prev.map((s) => (s.id === id ? data.estudiante : s)));
      toast.success("Estudiante actualizado");
      closeForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar estudiante");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar este estudiante?")) return;
    try {
      await api(`/estudiantes/${id}`, { method: "DELETE" });
      setEstudiantes((prev) => prev.filter((s) => s.id !== id));
      toast.success("Estudiante eliminado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar estudiante");
    }
  }

  function openCreate() {
    setEditingId(null);
    setFormNivel("");
    setFormTurno("");
    setShowForm(true);
    formDirty.current = false;
  }

  function openEdit(id: string) {
    setEditingId(id);
    const estudiante = estudiantes.find((e) => e.id === id);
    setFormNivel(estudiante?.nivel ?? "");
    setFormTurno(estudiante?.turno ?? "");
    setShowForm(true);
    formDirty.current = false;
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormNivel("");
    setFormTurno("");
    formDirty.current = false;
  }

  function handleBackdropClose() {
    if (formDirty.current && !confirm("¿Descartar cambios?")) return;
    closeForm();
  }

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Gestion de estudiantes</h1>
        <button
          onClick={openCreate}
          className="rounded-md bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white"
        >
          Nuevo estudiante
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={handleBackdropClose}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#1E3A5F]">
                {editingId ? "Editar estudiante" : "Nuevo estudiante"}
              </h2>
              <button onClick={handleBackdropClose} className="rounded-md bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">&times;</button>
            </div>
            <form
              onSubmit={(e) => {
                formDirty.current = false;
                return editingId ? handleUpdate(e, editingId) : handleCreate(e);
              }}
              onChange={() => { formDirty.current = true; }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <Label name="nombre" label="Nombre" defaultValue={editingEstudiante?.nombre} required />
              <Label name="fechaNacimiento" label="Fecha nacimiento" type="date" defaultValue={editingEstudiante?.fechaNacimiento?.slice(0, 10)} required />
              <Select name="genero" label="Genero" options={["M", "F"]} defaultValue={editingEstudiante?.genero} required />
              <Select
                name="nivel"
                label="Nivel"
                options={["BASICO", "INTERMEDIO", "AVANZADO"]}
                defaultValue={editingEstudiante?.nivel}
                required
                onValueChange={setFormNivel}
              />
              <Select
                name="turno"
                label="Turno"
                options={[
                  { value: "MATUTINO", label: "Sabatino - Mañana" },
                  { value: "VESPERTINO", label: "Sabatino - Tarde" },
                ]}
                defaultValue={editingEstudiante?.turno}
                required
                onValueChange={setFormTurno}
              />
              <Label name="correoElectronico" label="Correo" type="email" defaultValue={editingEstudiante?.correoElectronico ?? ""} />
              <Label name="telefono" label="Telefono" defaultValue={editingEstudiante?.telefono ?? ""} />
              <Label name="direccion" label="Direccion" className="sm:col-span-2" defaultValue={editingEstudiante?.direccion} required />
              <Label name="tutorNombre" label="Tutor nombre" defaultValue={editingEstudiante?.tutorNombre} required />
              <Label name="tutorParentesco" label="Tutor parentesco" defaultValue={editingEstudiante?.tutorParentesco} required />
              <Label name="tutorTelefono" label="Tutor telefono" defaultValue={editingEstudiante?.tutorTelefono} required />
              <Label name="tutorCorreo" label="Tutor correo" type="email" defaultValue={editingEstudiante?.tutorCorreo ?? ""} />
              <Label name="tutorDireccion" label="Tutor direccion" className="sm:col-span-2" defaultValue={editingEstudiante?.tutorDireccion ?? ""} />
              <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">Grupo asignado</p>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Automático</span>
                </div>
                {grupoSeleccionado ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-700">
                    <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#1E3A5F]">{grupoSeleccionado.nivel}</span>
                    <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#1E3A5F]">{grupoSeleccionado.turno}</span>
                    <span className="text-slate-500">{grupoSeleccionado.docente?.nombre ? `Docente: ${grupoSeleccionado.docente.nombre}` : "Sin docente"}</span>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">Selecciona nivel y turno para ver el grupo disponible.</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <p className="mb-2 text-sm font-semibold text-slate-900">Grupos disponibles</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {grupos.map((grupo) => {
                    const active = grupo.nivel === formNivel && grupo.turno === formTurno;
                    return (
                      <div key={`${grupo.nivel}-${grupo.turno}`} className={`rounded-xl border p-3 text-sm ${active ? "border-[#1E3A5F] bg-[#1E3A5F]/5" : "border-slate-200 bg-white"}`}>
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-slate-900">{grupo.nivel}</p>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{grupo.turno === "MATUTINO" ? "Mañana" : "Tarde"}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{grupo.docente?.nombre ? grupo.docente.nombre : "Sin docente"}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2 sm:col-span-2 sm:justify-end">
                <button type="button" onClick={handleBackdropClose} className="rounded-md bg-slate-500 px-4 py-2 text-sm font-semibold text-white">
                  Cancelar
                </button>
                <button type="submit" disabled={submitting} className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                  {submitting ? "Guardando..." : editingId ? "Guardar cambios" : "Guardar estudiante"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#1E3A5F]" />
        </div>
      ) : (
        <div className="elc-card mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-3">Matricula</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Nivel</th>
                <th className="p-3">Turno</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((e) => (
                <tr key={e.id} className="border-t border-slate-200">
                  <td className="p-3">{e.numeroMatricula}</td>
                  <td className="p-3">{e.nombre}</td>
                  <td className="p-3">{e.nivel}</td>
                  <td className="p-3">{e.turno}</td>
                  <td className="p-3">{e.estado}</td>
                  <td className="flex gap-2 p-3">
                    <button onClick={() => openEdit(e.id)} className="text-sm text-blue-700 underline">Editar</button>
                    <button onClick={() => handleDelete(e.id)} className="text-sm text-red-700 underline">Eliminar</button>
                  </td>
                </tr>
              ))}
              {estudiantes.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">No hay estudiantes registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function Label({ name, label, type = "text", required, defaultValue, className }: { name: string; label: string; type?: string; required?: boolean; defaultValue?: string; className?: string }) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      {label}
      <input name={name} type={type} defaultValue={defaultValue} className="mt-1 w-full rounded border p-2 text-sm" required={required} />
    </label>
  );
}

function Select({ name, label, options, required, defaultValue, className, onValueChange }: { name: string; label: string; options: Array<string | { value: string; label: string }>; required?: boolean; defaultValue?: string; className?: string; onValueChange?: (value: string) => void }) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded border p-2 text-sm"
        required={required}
        onChange={(e) => onValueChange?.(e.target.value)}
      >
        <option value="">Seleccionar</option>
        {options.map((o) => {
          const option = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

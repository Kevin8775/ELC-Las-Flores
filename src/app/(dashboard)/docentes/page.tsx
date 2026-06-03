"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Docente {
  id: string;
  nombre: string;
  correoElectronico: string;
  telefono?: string;
  genero?: string;
  direccion?: string;
  especialidad?: string;
  estado: string;
}

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const editingDocente = docentes.find((d) => d.id === editingId) ?? null;

  useEffect(() => {
    api<{ docentes: Docente[] }>("/docentes")
      .then((data) => setDocentes(data.docentes))
      .catch(() => {});
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const data = await api<{ docente: Docente }>("/docentes", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setDocentes((prev) => [...prev, data.docente]);
    closeForm();
  }

  async function handleUpdate(e: FormEvent, id: string) {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const data = await api<{ docente: Docente }>(`/docentes/${id}`, {
      method: "PUT",
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setDocentes((prev) => prev.map((d) => (d.id === id ? data.docente : d)));
    closeForm();
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar este docente?")) return;
    await api(`/docentes/${id}`, { method: "DELETE" });
    setDocentes((prev) => prev.filter((d) => d.id !== id));
  }

  function openCreate() {
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(id: string) {
    setEditingId(id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Gestion de docentes</h1>
        <button
          onClick={openCreate}
          className="rounded-md bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white"
        >
          Nuevo docente
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeForm}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#1E3A5F]">
                {editingId ? "Editar docente" : "Nuevo docente"}
              </h2>
              <button onClick={closeForm} className="rounded-md bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">&times;</button>
            </div>
            <form
              onSubmit={(e) => editingId ? handleUpdate(e, editingId) : handleCreate(e)}
              className="grid gap-4 sm:grid-cols-2"
            >
              <Label name="nombre" label="Nombre" defaultValue={editingDocente?.nombre} required />
              <Label name="correoElectronico" label="Correo electronico" type="email" defaultValue={editingDocente?.correoElectronico} required />
              <Label name="telefono" label="Telefono" defaultValue={editingDocente?.telefono ?? ""} />
              <Label name="fechaNacimiento" label="Fecha nacimiento" type="date" />
              <Select name="genero" label="Genero" options={["M", "F"]} defaultValue={editingDocente?.genero} />
              <Label name="direccion" label="Direccion" defaultValue={editingDocente?.direccion ?? ""} />
              <Label name="especialidad" label="Especialidad" defaultValue={editingDocente?.especialidad ?? ""} />
              <Label name="fechaIngreso" label="Fecha ingreso" type="date" />
              <div className="flex gap-2 sm:col-span-2 sm:justify-end">
                <button type="button" onClick={closeForm} className="rounded-md bg-slate-500 px-4 py-2 text-sm font-semibold text-white">
                  Cancelar
                </button>
                <button type="submit" className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white">
                  {editingId ? "Guardar cambios" : "Guardar docente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="elc-card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Especialidad</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docentes.map((d) => (
              <tr key={d.id} className="border-t border-slate-200">
                <td className="p-3">{d.nombre}</td>
                <td className="p-3">{d.correoElectronico}</td>
                <td className="p-3">{d.especialidad ?? "-"}</td>
                <td className="p-3">{d.estado}</td>
                <td className="flex gap-2 p-3">
                  <button onClick={() => openEdit(d.id)} className="text-sm text-blue-700 underline">Editar</button>
                  <button onClick={() => handleDelete(d.id)} className="text-sm text-red-700 underline">Eliminar</button>
                </td>
              </tr>
            ))}
            {docentes.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">No hay docentes registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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

function Select({ name, label, options, required, defaultValue, className }: { name: string; label: string; options: string[]; required?: boolean; defaultValue?: string; className?: string }) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      {label}
      <select name={name} defaultValue={defaultValue} className="mt-1 w-full rounded border p-2 text-sm" required={required}>
        <option value="">Seleccionar</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

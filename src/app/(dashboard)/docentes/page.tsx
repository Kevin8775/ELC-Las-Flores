"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MultiStepForm, Step } from "@/components/ui/MultiStepForm";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

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

const step1Schema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  correoElectronico: z.string().email("Correo invalido").min(1, "Correo requerido"),
  telefono: z.string().optional().or(z.literal("")),
  genero: z.string().optional().or(z.literal("")),
});

const step2Schema = z.object({
  direccion: z.string().optional().or(z.literal("")),
  especialidad: z.string().optional().or(z.literal("")),
});

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const editingDocente = docentes.find((d) => d.id === editingId) ?? null;

  useEffect(() => {
    api<{ docentes: Docente[] }>("/docentes")
      .then((data) => setDocentes(data.docentes))
      .catch(() => toast.error("Error al cargar docentes"))
      .finally(() => setLoading(false));
  }, []);

  const defaultValues = useMemo(() => {
    if (editingDocente) {
      return {
        nombre: editingDocente.nombre,
        correoElectronico: editingDocente.correoElectronico,
        telefono: editingDocente.telefono ?? "",
        genero: editingDocente.genero ?? "",
        direccion: editingDocente.direccion ?? "",
        especialidad: editingDocente.especialidad ?? "",
      };
    }
    return {
      nombre: "",
      correoElectronico: "",
      telefono: "",
      genero: "",
      direccion: "",
      especialidad: "",
    };
  }, [editingDocente]);

  async function handleSubmit(data: any) {
    setSubmitting(true);
    try {
      if (editingId) {
        const result = await api<{ docente: Docente }>(`/docentes/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        setDocentes((prev) => prev.map((d) => (d.id === editingId ? result.docente : d)));
        toast.success("Docente actualizado");
      } else {
        const result = await api<{ docente: Docente }>("/docentes", {
          method: "POST",
          body: JSON.stringify(data),
        });
        setDocentes((prev) => [...prev, result.docente]);
        toast.success("Docente creado");
      }
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar docente");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar este docente?")) return;
    try {
      await api(`/docentes/${id}`, { method: "DELETE" });
      setDocentes((prev) => prev.filter((d) => d.id !== id));
      toast.success("Docente eliminado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar docente");
    }
  }

  const steps: Step[] = [
    {
      label: "Datos personales",
      schema: step1Schema,
      children: (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="nombre" label="Nombre completo" required />
          <Input name="correoElectronico" label="Correo electronico" type="email" required />
          <Input name="telefono" label="Telefono" />
          <Select name="genero" label="Genero" options={["M", "F"]} />
        </div>
      ),
    },
    {
      label: "Detalles",
      schema: step2Schema,
      children: (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="direccion" label="Direccion" className="sm:col-span-2" />
          <Input name="especialidad" label="Especialidad" />
        </div>
      ),
    },
  ];

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Gestion de docentes</h1>
        <Button onClick={() => { setEditingId(null); setShowForm(true); }}>
          Nuevo docente
        </Button>
      </div>

      {showForm && (
        <MultiStepForm
          steps={steps}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          mode="modal"
          isEditing={!!editingId}
          title={editingId ? "Editar docente" : "Nuevo docente"}
          onClose={() => { setShowForm(false); setEditingId(null); }}
          dirtyCheck
          submitting={submitting}
        />
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
                    <button onClick={() => { setEditingId(d.id); setShowForm(true); }} className="text-sm text-blue-700 underline">Editar</button>
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
      )}
    </main>
  );
}

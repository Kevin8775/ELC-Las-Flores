"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MultiStepForm, Step } from "@/components/ui/MultiStepForm";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

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

const step1Schema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  fechaNacimiento: z.string().min(1, "Fecha requerida"),
  genero: z.enum(["M", "F"], { message: "Genero requerido" }),
});

const step2Schema = z.object({
  nivel: z.enum(["BASICO", "INTERMEDIO", "AVANZADO"], { message: "Nivel requerido" }),
  turno: z.enum(["MATUTINO", "VESPERTINO"], { message: "Turno requerido" }),
});

const step3Schema = z.object({
  correoElectronico: z.string().email("Correo invalido").optional().or(z.literal("")),
  telefono: z.string().optional().or(z.literal("")),
  direccion: z.string().min(1, "Direccion requerida"),
});

const step4Schema = z.object({
  tutorNombre: z.string().min(1, "Nombre del tutor requerido"),
  tutorParentesco: z.string().min(1, "Parentesco requerido"),
  tutorTelefono: z.string().min(1, "Telefono del tutor requerido"),
  tutorCorreo: z.string().email("Correo invalido").optional().or(z.literal("")),
  tutorDireccion: z.string().optional().or(z.literal("")),
});

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [grupos, setGrupos] = useState<GrupoDisponible[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const defaultValues = useMemo(() => {
    if (editingEstudiante) {
      return {
        nombre: editingEstudiante.nombre,
        fechaNacimiento: editingEstudiante.fechaNacimiento?.slice(0, 10) ?? "",
        genero: editingEstudiante.genero,
        nivel: editingEstudiante.nivel,
        turno: editingEstudiante.turno,
        correoElectronico: editingEstudiante.correoElectronico ?? "",
        telefono: editingEstudiante.telefono ?? "",
        direccion: editingEstudiante.direccion,
        tutorNombre: editingEstudiante.tutorNombre,
        tutorParentesco: editingEstudiante.tutorParentesco,
        tutorTelefono: editingEstudiante.tutorTelefono,
        tutorCorreo: editingEstudiante.tutorCorreo ?? "",
        tutorDireccion: editingEstudiante.tutorDireccion ?? "",
      };
    }
    return {
      nombre: "",
      fechaNacimiento: "",
      genero: "",
      nivel: "",
      turno: "",
      correoElectronico: "",
      telefono: "",
      direccion: "",
      tutorNombre: "",
      tutorParentesco: "",
      tutorTelefono: "",
      tutorCorreo: "",
      tutorDireccion: "",
    };
  }, [editingEstudiante]);

  async function handleSubmit(data: any) {
    setSubmitting(true);
    try {
      if (editingId) {
        const result = await api<{ estudiante: Estudiante }>(`/estudiantes/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        setEstudiantes((prev) => prev.map((s) => (s.id === editingId ? result.estudiante : s)));
        toast.success("Estudiante actualizado");
      } else {
        const result = await api<{ estudiante: Estudiante }>("/estudiantes", {
          method: "POST",
          body: JSON.stringify(data),
        });
        setEstudiantes((prev) => [...prev, result.estudiante]);
        toast.success("Estudiante creado");
      }
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar estudiante");
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

  function GrupoPreview({ grupos }: { grupos: GrupoDisponible[] }) {
    const { watch } = useFormContext();
    const nivel = watch("nivel");
    const turno = watch("turno");
    const grupo = useMemo(() => {
      if (!nivel || !turno) return null;
      return grupos.find((g) => g.nivel === nivel && g.turno === turno) ?? null;
    }, [nivel, turno, grupos]);

    return (
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">Grupo asignado</p>
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Automatico</span>
        </div>
        {grupo ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-700">
            <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#1E3A5F]">{grupo.nivel}</span>
            <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#1E3A5F]">{grupo.turno}</span>
            <span className="text-slate-500">{grupo.docente?.nombre ? `Docente: ${grupo.docente.nombre}` : "Sin docente"}</span>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">Selecciona nivel y turno para ver el grupo.</p>
        )}
      </div>
    );
  }

  function Step1() {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="nombre" label="Nombre completo" required />
        <Input name="fechaNacimiento" label="Fecha de nacimiento" type="date" required />
        <Select name="genero" label="Genero" options={["M", "F"]} required />
      </div>
    );
  }

  function Step2() {
    return (
      <div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            name="nivel"
            label="Nivel"
            options={["BASICO", "INTERMEDIO", "AVANZADO"]}
            required
          />
          <Select
            name="turno"
            label="Turno"
            options={[
              { value: "MATUTINO", label: "Sabatino - Mañana" },
              { value: "VESPERTINO", label: "Sabatino - Tarde" },
            ]}
            required
          />
        </div>
        <GrupoPreview grupos={grupos} />
      </div>
    );
  }

  function Step3() {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="correoElectronico" label="Correo electronico" type="email" />
        <Input name="telefono" label="Telefono" />
        <Input name="direccion" label="Direccion completa" className="sm:col-span-2" required />
      </div>
    );
  }

  function Step4() {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="tutorNombre" label="Nombre del tutor" required />
        <Input name="tutorParentesco" label="Parentesco" required />
        <Input name="tutorTelefono" label="Telefono del tutor" required />
        <Input name="tutorCorreo" label="Correo del tutor" type="email" />
        <Input name="tutorDireccion" label="Direccion del tutor" className="sm:col-span-2" />
      </div>
    );
  }

  const steps: Step[] = [
    { label: "Datos personales", schema: step1Schema, children: <Step1 /> },
    { label: "Academico", schema: step2Schema, children: <Step2 /> },
    { label: "Contacto", schema: step3Schema, children: <Step3 /> },
    { label: "Tutor", schema: step4Schema, children: <Step4 /> },
  ];

  return (
    <main>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Gestion de estudiantes</h1>
        <Button onClick={() => { setEditingId(null); setShowForm(true); }}>
          Nuevo estudiante
        </Button>
      </div>

      {showForm && (
        <MultiStepForm
          steps={steps}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          mode="modal"
          isEditing={!!editingId}
          title={editingId ? "Editar estudiante" : "Nuevo estudiante"}
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
                    <button onClick={() => { setEditingId(e.id); setShowForm(true); }} className="text-sm text-blue-700 underline">Editar</button>
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

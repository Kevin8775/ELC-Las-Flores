"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { AssignTeacherModal } from "@/components/grupo/AssignTeacherModal";
import { TeacherWarningModal } from "@/components/grupo/TeacherWarningModal";
import { UserCheck, AlertCircle } from "lucide-react";

interface Docente {
  id: string;
  nombre: string;
  email: string;
}

interface GrupoEstudiante {
  id: string;
  nombre: string;
  numeroMatricula: string;
}

interface Grupo {
  id: string;
  nivel: string;
  turno: string;
  docente: Docente | null;
  estudiantes: GrupoEstudiante[];
  estudianteCount: number;
}

interface ExistingGroup {
  id: string;
  nivel: string;
  turno: string;
}

const turnoLabel: Record<string, string> = {
  MATUTINO: "Mañana",
  VESPERTINO: "Tarde",
  SABATINO: "Sabatino",
};

export default function GruposPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Modal states
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningData, setWarningData] = useState<{
    docenteId: string;
    docenteNombre: string;
    existingGroups: ExistingGroup[];
    newGrupo: Grupo;
  } | null>(null);
  const [reassigningId, setReassigningId] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const loadGrupos = async () => {
    try {
      setLoading(true);
      const data = await api<{ grupos: Grupo[] }>("/grupos");
      setGrupos(data.grupos);
    } catch (err) {
      console.error("Error loading grupos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load grupos on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      void loadGrupos();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleAssignClick = (grupo: Grupo) => {
    setSelectedGrupo(grupo);
    setAssignModalOpen(true);
  };

  const handleAssignSuccess = async (_docenteId: string, _docenteNombre: string) => {
    void _docenteId;
    void _docenteNombre;
    await loadGrupos();
    setAssignModalOpen(false);
    setSelectedGrupo(null);
  };

  const handleAssignWarning = async (docenteId: string, docenteNombre: string, existingGroups: ExistingGroup[]) => {
    if (selectedGrupo) {
      setWarningData({
        docenteId,
        docenteNombre,
        existingGroups,
        newGrupo: selectedGrupo,
      });
      setAssignModalOpen(false);
      setWarningModalOpen(true);
    }
  };

  const handleWarningConfirm = async () => {
    if (!warningData) return;

    setReassigningId(warningData.docenteId);
    try {
      await api(`/grupos/${warningData.newGrupo.id}/reassign-teacher`, {
        method: "POST",
        body: JSON.stringify({ docenteId: warningData.docenteId }),
      });

      await loadGrupos();
      setWarningModalOpen(false);
      setWarningData(null);
    } catch (err) {
      console.error("Error reassigning teacher:", err);
    } finally {
      setReassigningId(null);
    }
  };

  if (loading) {
    return (
      <main>
        <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Grupos</h1>
        <p className="mt-4 text-slate-400">Cargando grupos...</p>
      </main>
    );
  }

  return (
    <main>
      <h1 className="font-serif text-3xl font-bold text-[#1E3A5F]">Grupos</h1>
      <p className="mt-1 text-sm text-slate-500">
        {isAdmin ? "Asigna docentes a cada grupo" : "Grupos de estudiantes"}
      </p>

      {grupos.length === 0 && (
        <div className="elc-card mt-6 p-6 text-center text-slate-400">
          No hay grupos disponibles
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {grupos.map((grupo) => (
          <div
            key={grupo.id}
            className="elc-card overflow-hidden transition-shadow hover:shadow-md"
          >
            {/* Header */}
            <div
              className={`px-4 py-3 text-white ${
                grupo.docente ? "bg-[#1E3A5F]" : "bg-amber-600"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {grupo.docente ? (
                      <UserCheck className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <h2 className="font-serif font-bold truncate">
                      {grupo.docente?.nombre || "Sin docente asignado"}
                    </h2>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span className="inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                      {grupo.nivel}
                    </span>
                    <span className="inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                      {turnoLabel[grupo.turno] ?? grupo.turno}
                    </span>
                  </div>
                </div>

                {/* Assign button - visible only for admin */}
                {isAdmin && (
                  <button
                    onClick={() => handleAssignClick(grupo)}
                    className={`mt-1 whitespace-nowrap rounded px-2 py-1 text-xs font-medium transition-colors ${
                      grupo.docente
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : "bg-white text-amber-600 hover:bg-gray-100 font-semibold"
                    }`}
                  >
                    {grupo.docente ? "Cambiar" : "Asignar"}
                  </button>
                )}
              </div>
            </div>

            {/* Body - Students list */}
            <div className="p-4">
              <p className="mb-2 text-xs font-semibold text-slate-500">
                {grupo.estudianteCount} estudiante{
                  grupo.estudianteCount !== 1 ? "s" : ""
                }
              </p>

              {grupo.estudiantes.length > 0 ? (
                <ul className="space-y-1">
                  {grupo.estudiantes.map((e) => (
                    <li
                      key={e.id}
                      className="flex items-center justify-between rounded bg-slate-50 px-3 py-1.5 text-sm"
                    >
                      <span>{e.nombre}</span>
                      <span className="font-mono text-xs text-slate-400">
                        {e.numeroMatricula}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">Sin estudiantes</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {selectedGrupo && (
        <AssignTeacherModal
          isOpen={assignModalOpen}
          grupoId={selectedGrupo.id}
          nivel={selectedGrupo.nivel}
          turno={turnoLabel[selectedGrupo.turno] ?? selectedGrupo.turno}
          onClose={() => {
            setAssignModalOpen(false);
            setSelectedGrupo(null);
          }}
          onSuccess={handleAssignSuccess}
          onWarning={handleAssignWarning}
        />
      )}

      {warningData && (
        <TeacherWarningModal
          isOpen={warningModalOpen}
          docenteNombre={warningData.docenteNombre}
          grupoNivel={warningData.existingGroups[0]?.nivel || ""}
          grupoTurno={turnoLabel[warningData.existingGroups[0]?.turno] || warningData.existingGroups[0]?.turno || ""}
          currentGrupoNivel={warningData.newGrupo.nivel}
          currentGrupoTurno={turnoLabel[warningData.newGrupo.turno] ?? warningData.newGrupo.turno}
          onCancel={() => {
            setWarningModalOpen(false);
            setWarningData(null);
            setSelectedGrupo(null);
            setAssignModalOpen(true);
          }}
          onConfirm={handleWarningConfirm}
          isLoading={reassigningId === warningData.docenteId}
        />
      )}
    </main>
  );
}

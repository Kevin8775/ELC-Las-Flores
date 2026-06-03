"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { X } from "lucide-react";

interface Docente {
  id: string;
  nombre: string;
  correoElectronico: string;
}

interface AssignTeacherModalProps {
  isOpen: boolean;
  grupoId: string;
  nivel: string;
  turno: string;
  onClose: () => void;
  onSuccess: (docenteId: string, docenteNombre: string) => void;
  onWarning: (docenteId: string, docenteNombre: string, existingGroups: Array<{ id: string; nivel: string; turno: string }>) => void;
}

export function AssignTeacherModal({
  isOpen,
  grupoId,
  nivel,
  turno,
  onClose,
  onSuccess,
  onWarning,
}: AssignTeacherModalProps) {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [selectedDocente, setSelectedDocente] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingDocentes, setLoadingDocentes] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setLoadingDocentes(true);
        api<{ docentes: Docente[] }>("/grupos/available/teachers")
          .then((data) => {
            setDocentes(data.docentes);
            setError("");
          })
          .catch((err) => {
            setError("Error al cargar docentes");
            console.error(err);
          })
          .finally(() => setLoadingDocentes(false));
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleAssign = async () => {
    if (!selectedDocente) {
      setError("Selecciona un docente");
      return;
    }

    setLoading(true);
    setError("");

    const selectedDocente_obj = docentes.find((d) => d.id === selectedDocente);
    const docenteNombre = selectedDocente_obj?.nombre || "Docente";

    try {
      const response = await api<{ hasExistingGroup?: boolean; existingGroups?: Array<{ id: string; nivel: string; turno: string }> }>(`/grupos/${grupoId}/assign-teacher`, {
        method: "POST",
        body: JSON.stringify({ docenteId: selectedDocente }),
      });

      if (response.hasExistingGroup) {
        onWarning(selectedDocente, docenteNombre, response.existingGroups ?? []);
      } else {
        onSuccess(selectedDocente, docenteNombre);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al asignar docente");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1E3A5F]">Asignar Docente</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 space-y-2">
            <p className="text-sm text-gray-600">
            Grupo: <span className="font-semibold">{nivel} - {turno}</span>
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Seleccionar Docente
          </label>
          {loadingDocentes ? (
            <div className="text-center text-sm text-gray-500">Cargando docentes...</div>
          ) : (
            <select
              value={selectedDocente}
              onChange={(e) => setSelectedDocente(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">-- Selecciona un docente --</option>
              {docentes.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleAssign}
            disabled={loading || !selectedDocente}
            className="flex-1 rounded bg-[#1E3A5F] px-4 py-2 text-sm font-medium text-white hover:bg-[#162d47] disabled:opacity-50"
          >
            {loading ? "Asignando..." : "Asignar"}
          </button>
        </div>
      </div>
    </div>
  );
}

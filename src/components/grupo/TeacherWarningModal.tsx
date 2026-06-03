"use client";

import { X } from "lucide-react";

interface TeacherWarningModalProps {
  isOpen: boolean;
  docenteNombre: string;
  grupoNivel: string;
  grupoTurno: string;
  currentGrupoNivel: string;
  currentGrupoTurno: string;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function TeacherWarningModal({
  isOpen,
  docenteNombre,
  grupoNivel,
  grupoTurno,
  currentGrupoNivel,
  currentGrupoTurno,
  onCancel,
  onConfirm,
  isLoading,
}: TeacherWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <span className="text-xl">⚠️</span>
            </div>
            <h2 className="text-lg font-bold text-[#1E3A5F]">Advertencia</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-sm text-gray-700">
            El docente <span className="font-semibold">{docenteNombre}</span> ya tiene asignado el grupo:
          </p>
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="font-semibold text-blue-900">
              {grupoNivel} - {grupoTurno}
            </p>
          </div>
          <p className="text-sm text-gray-700">
            Si continúas, el docente será desasignado de ese grupo y asignado al grupo:
          </p>
          <div className="rounded-lg bg-purple-50 p-3">
            <p className="font-semibold text-purple-900">
              {currentGrupoNivel} - {currentGrupoTurno}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
          >
            {isLoading ? "Reasignando..." : "Continuar Reasignar"}
          </button>
        </div>
      </div>
    </div>
  );
}

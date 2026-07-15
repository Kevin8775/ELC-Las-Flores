"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  dirtyCheck?: boolean;
  isDirty?: boolean;
}

export function Modal({ open, onClose, title, children, className, dirtyCheck, isDirty }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (dirtyCheck && isDirty) {
          if (!confirm("¿Descartar cambios?")) return;
        }
        onClose();
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose, dirtyCheck, isDirty]);

  if (!open) return null;

  function handleBackdrop() {
    if (dirtyCheck && isDirty) {
      if (!confirm("¿Descartar cambios?")) return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" ref={overlayRef} onClick={handleBackdrop}>
      <div
        className={cn("max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white p-6 shadow-2xl", className)}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-[#1E3A5F]">{title}</h2>
            <button onClick={handleBackdrop} className="rounded-md bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

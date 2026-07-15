"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "./Button";

interface Step {
  label: string;
}

interface StepWizardProps {
  currentStep: number;
  steps: Step[];
  onPrev: () => void;
  onNext: () => void;
  onFinalSubmit?: () => void;
  isFirst: boolean;
  isLast: boolean;
  submitting?: boolean;
  submitLabel?: string;
  title?: string;
  onClose?: () => void;
  children: ReactNode;
}

export function StepWizard({
  currentStep,
  steps,
  onPrev,
  onNext,
  onFinalSubmit,
  isFirst,
  isLast,
  submitting = false,
  submitLabel,
  title,
  onClose,
  children,
}: StepWizardProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="elc-card p-6">
      {title && <h2 className="mb-4 text-lg font-bold text-[#1E3A5F]">{title}</h2>}

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  i < currentStep
                    ? "bg-green-500 text-white"
                    : i === currentStep
                    ? "bg-[#1E3A5F] text-white"
                    : "bg-slate-200 text-slate-500"
                )}
              >
                {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  i <= currentStep ? "text-[#1E3A5F]" : "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#1E3A5F] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[200px] animate-[fade-in_0.2s_ease-out]">
        {children}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between gap-2">
        <div>
          {!isFirst && (
            <Button type="button" variant="secondary" onClick={onPrev}>
              ← Anterior
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {onClose && (
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          )}
          {isLast ? (
            <Button type="button" loading={submitting} variant="accent" onClick={onFinalSubmit}>
              {submitLabel ?? "Guardar"}
            </Button>
          ) : (
            <Button type="button" onClick={onNext}>
              Siguiente →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

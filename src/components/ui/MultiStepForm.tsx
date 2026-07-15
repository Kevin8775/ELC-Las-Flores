"use client";

import { ReactNode, useState } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { Check } from "lucide-react";
import { toast } from "sonner";

export interface Step {
  label: string;
  schema?: z.ZodTypeAny;
  children: ReactNode | ((form: UseFormReturn) => ReactNode);
}

interface MultiStepFormProps {
  steps: Step[];
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
  mode?: "modal" | "inline";
  isEditing?: boolean;
  title?: string;
  onClose?: () => void;
  dirtyCheck?: boolean;
  submitting?: boolean;
  submitLabel?: string;
}

export function MultiStepForm({
  steps,
  onSubmit,
  defaultValues = {},
  mode = "modal",
  isEditing = false,
  title,
  onClose,
  dirtyCheck = false,
  submitting = false,
  submitLabel,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const form = useForm({
    mode: "onTouched",
    defaultValues,
  });

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  async function handleNext() {
    const step = steps[currentStep];
    if (step.schema) {
      const values = form.getValues();
      const result = step.schema.safeParse(values);
      if (!result.success) {
        const firstError = result.error.issues[0];
        if (firstError) {
          toast.warning(firstError.message);
          const field = firstError.path[0] as string | undefined;
          if (field) {
            form.setError(field, { message: firstError.message });
          }
        }
        return;
      }
    }
    setDirection("next");
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function handlePrev() {
    setDirection("prev");
    setCurrentStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit(data: any) {
    onSubmit(data);
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  const currentStepData = steps[currentStep];
  const stepContent = typeof currentStepData.children === "function"
    ? currentStepData.children(form)
    : currentStepData.children;

  const content = (
    <>
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
      <div className={cn(
        "min-h-[200px]",
        direction === "next" ? "animate-[slide-up_0.2s_ease-out]" : "animate-[fade-in_0.2s_ease-out]"
      )}>
        {stepContent}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between gap-2">
        <div>
          {!isFirst && (
            <Button type="button" variant="secondary" onClick={handlePrev}>
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
            <Button type="submit" loading={submitting} variant="accent">
              {submitLabel ?? (isEditing ? "Guardar cambios" : "Crear")}
            </Button>
          ) : (
            <Button type="button" onClick={handleNext}>
              Siguiente →
            </Button>
          )}
        </div>
      </div>
    </>
  );

  if (mode === "inline") {
    return (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="elc-card p-6">
          {title && <h2 className="mb-4 text-lg font-bold text-[#1E3A5F]">{title}</h2>}
          {content}
        </form>
      </FormProvider>
    );
  }

  return (
    <Modal open onClose={onClose!} dirtyCheck={dirtyCheck} isDirty={form.formState.isDirty}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {title && <h2 className="mb-4 font-serif text-xl font-bold text-[#1E3A5F]">{title}</h2>}
          {content}
        </form>
      </FormProvider>
    </Modal>
  );
}

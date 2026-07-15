import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, required, ...props }, ref) => {
    return (
      <label className={cn("block text-sm", className)}>
        <span className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
        <input
          ref={ref}
          required={required}
          className={cn(
            "mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition",
            "focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500/10"
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </label>
    );
  }
);
Input.displayName = "Input";

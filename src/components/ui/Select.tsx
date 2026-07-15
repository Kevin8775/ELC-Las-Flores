import { cn } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

type Option = string | { value: string; label: string };

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  placeholder?: string;
  error?: string;
  registerReturn?: any;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, placeholder = "Seleccionar", error, required, registerReturn, ...props }, ref) => {
    return (
      <label className={cn("block text-sm", className)}>
        <span className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
        <select
          ref={ref}
          required={required}
          className={cn(
            "mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition",
            "focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/10",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500/10"
          )}
          {...registerReturn}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => {
            const opt = typeof o === "string" ? { value: o, label: o } : o;
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </label>
    );
  }
);
Select.displayName = "Select";

// src/components/ui/Input.tsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // 🚀 Import Icon Mata Sakti

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = ({
  label,
  error,
  className,
  type,
  ...props
}: InputProps) => {
  // 👁️ State buat saklar nampilin password
  const [showPassword, setShowPassword] = useState(false);

  // Cek apakah inputan ini aslinya ber-type password
  const isPasswordType = type === "password";

  // Tentukan type real yang dirender (jika di-toggle, berubah dari password ke text)
  const renderType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="space-y-1.5 w-full relative">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          type={renderType}
          className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border rounded-xl outline-none focus:ring-2 transition-all 
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            ${isPasswordType ? "pr-12" : ""} ${""}
            ${
              error
                ? "border-red-500 focus:ring-red-500/20"
                : "border-neutral-200 dark:border-neutral-700 focus:ring-emerald-500/20 focus:border-emerald-500"
            } ${className}`}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors focus:outline-none">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string | number }[];
  error?: string;
}

export const Select = ({
  label,
  options,
  error,
  className,
  ...props
}: SelectProps) => {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <select
        className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border rounded-xl outline-none focus:ring-2 appearance-none transition-all ${
          error
            ? "border-red-500 focus:ring-red-500/20"
            : "border-neutral-200 dark:border-neutral-700 focus:ring-emerald-500/20 focus:border-emerald-500"
        } ${className}`}
        {...props}>
        <option value="" disabled selected>
          Pilih {label}...
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

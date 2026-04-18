interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  rows?: number;
}

export const Textarea = ({
  label,
  error,
  rows = 4,
  className,
  ...props
}: TextareaProps) => {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <textarea
        rows={rows}
        className={`w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border rounded-xl outline-none focus:ring-2 transition-all resize-y min-h-25 ${
          error
            ? "border-red-500 focus:ring-red-500/20"
            : "border-neutral-200 dark:border-neutral-700 focus:ring-emerald-500/20 focus:border-emerald-500"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

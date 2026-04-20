interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "outline" | "ghost" | "success" | "warning"; // Tambah success & warning
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = ({
  variant = "primary",
  size = "md", // Default ke md
  isLoading,
  children,
  className,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
    success:
      "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20", // Tambahin ini Bre!
    danger: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-white", // Buat jaga-jaga
    outline:
      "border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800",
    ghost:
      "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      disabled={isLoading || props.disabled}
      className={`rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}>
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

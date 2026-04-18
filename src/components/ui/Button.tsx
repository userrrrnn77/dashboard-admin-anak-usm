interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg"; // Tambahin ini biar kaga tantrum
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
    danger: "bg-red-500 hover:bg-red-600 text-white",
    outline:
      "border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800",
    ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800",
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

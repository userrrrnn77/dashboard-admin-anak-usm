interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info";
}

export const Badge = ({ children, variant = "info" }: BadgeProps) => {
  const variants = {
    success:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    warning:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
};

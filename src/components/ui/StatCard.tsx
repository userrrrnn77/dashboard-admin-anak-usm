interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

export const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-neutral-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
    </div>
  );
};

export const Table = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
      <table className="w-full text-sm text-left">{children}</table>
    </div>
  );
};

export const THead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 uppercase text-[11px] font-bold tracking-wider">
    {children}
  </thead>
);

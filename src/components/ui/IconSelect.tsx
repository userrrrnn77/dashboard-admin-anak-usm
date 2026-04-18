import { Icon } from "./Icon";

interface IconSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

// List icon yang relevan buat bisnis digital/koperasi lu
const ICON_LIST = [
  "LayoutDashboard",
  "Users",
  "Package",
  "HeartHandshake",
  "BadgeCheck",
  "Wallet",
  "PiggyBank",
  "TrendingUp",
  "ShieldCheck",
  "Info",
  "HelpCircle",
];

export const IconSelect = ({
  label,
  value,
  onChange,
  error,
}: IconSelectProps) => {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      <div className="grid grid-cols-6 gap-2 p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl">
        {ICON_LIST.map((iconName) => (
          <button
            key={iconName}
            type="button"
            onClick={() => onChange(iconName)}
            className={`p-2 rounded-lg flex items-center justify-center transition-all ${
              value === iconName
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500"
            }`}>
            <Icon name={iconName} size={22} />
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

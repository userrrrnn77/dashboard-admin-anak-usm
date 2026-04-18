import * as Icons from "lucide-react";
import { type LucideProps } from "lucide-react";

// Kita bikin tipe khusus yang isinya semua nama icon yang ada di Lucide
type IconName = keyof typeof Icons;

interface IconProps extends LucideProps {
  name: string; // Nama icon dari database
}

export const Icon = ({
  name,
  color,
  size = 20,
  className,
  ...props
}: IconProps) => {
  // Casting 'name' ke 'IconName' biar TS kaga curiga
  const iconKey = name as IconName;

  // Ambil komponennya, tapi kita validasi apakah beneran fungsi/komponen
  const LucideIcon = Icons[iconKey] as React.ElementType;

  // Kalau icon kaga ketemu atau bukan komponen, kasih HelpCircle
  if (!LucideIcon || typeof LucideIcon !== "function") {
    return (
      <Icons.HelpCircle
        size={size}
        color={color}
        className={className}
        {...props}
      />
    );
  }

  return (
    <LucideIcon size={size} color={color} className={className} {...props} />
  );
};

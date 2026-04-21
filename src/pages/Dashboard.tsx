import { StatCard } from "../components/ui/StatCard";
import { useUser, type RegistrationData } from "../hooks/useUser";
import { useBaitulMaal } from "../hooks/useBaitulMaal";
import { Users, HeartHandshake, Package, UserCheck } from "lucide-react";
// Import interface pendaftar buat ngilangin 'any' di map
import { type User } from "../api/user";
import { type CreateBaitulMaal } from "../api/baitulMaal";
import { useProduct } from "../hooks/useProduct";

const Dashboard = () => {
  // Casting manual di sini biar TS kaga pusing pas panggil .length
  const { users, registrations, isLoading: userLoading } = useUser();

  const { programs, isLoading: programLoading } = useBaitulMaal();

  const {products} = useProduct()

  const isLoading = userLoading || programLoading;

  // Type-safety casting buat linter lu yang galak
  const userList = users as User[];
  const regList = registrations as RegistrationData[]; // Registrasi biasanya strukturnya mirip User
  const programList = programs as CreateBaitulMaal[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-neutral-500 text-sm">
          Pantau semua aktivitas Bisnis Digital lu di sini, Bre.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Admin"
          value={isLoading ? "..." : userList.length}
          icon={<Users size={24} />}
          />
        <StatCard
          title="Pendaftar Baru"
          value={isLoading ? "..." : regList.length}
          icon={<UserCheck size={24} />}
          trend="+5% dr minggu lalu"
        />
        <StatCard
          title="Program Aktif"
          value={isLoading ? "..." : programList.length}
          icon={<HeartHandshake size={24} />}
        />
        <StatCard
          title="Total Produk"
          value={isLoading ? "...": products.length} // Property 'length' does not exist on type '{}'.
          icon={<Package size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tailwind Suggestion: min-h-75 sesuai kemauan linter lu */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-700 min-h-75">
          <h3 className="font-bold mb-4">Grafik Pertumbuhan (Coming Soon)</h3>
          <div className="flex items-center justify-center h-full text-neutral-400 italic">
            Visualisasi data nyusul, kita rakit CRUD dulu Bre...
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-700">
          <h3 className="font-bold mb-4">Aktivitas Terakhir</h3>
          <div className="space-y-4">
            {/* Slice sekarang aman karena udah di-cast ke Array */}
            {regList.slice(0, 3).map((reg) => (
              <div
                key={reg.phoneNumber || reg.fullName}
                className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold uppercase">
                  {reg.fullName?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="font-medium">{reg.fullName || "Anonim"}</p>
                  <p className="text-xs text-neutral-500">
                    Mendaftar sebagai Member
                  </p>
                </div>
              </div>
            ))}
            {!isLoading && regList.length === 0 && (
              <p className="text-xs text-neutral-400 text-center py-4">
                Belum ada pendaftar baru.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

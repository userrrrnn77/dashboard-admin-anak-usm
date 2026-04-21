import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/Input";
// import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { UserPlus, ArrowLeft } from "lucide-react";
import Title from "../components/common/Title";

const Register = () => {
  const navigate = useNavigate();
  const { registerAction, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    role: "ADMIN",
    imageProfile: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await registerAction(formData);
    if (success) {
      // Kalo sukses, balikin ke halaman manajemen user
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-200/50 dark:shadow-none">
      <Title>
        Regitrasi User | Dashboard Admin
      </Title>
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Daftarkan Admin</h1>
          <p className="text-sm text-neutral-500">
            Tambah personil baru buat urusin Mabes, Bre.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Nama */}
          <Input
            label="Nama Lengkap"
            placeholder="Contoh: Bagas Icikiwir"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          {/* Input Phone */}
          <Input
            label="Nomor WhatsApp"
            placeholder="08123xxx"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
          />

          {/* Input Password */}
          <Input
            label="Password"
            placeholder="••••••••"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          {/* Input Image URL (Biar gampang, pake string dulu) */}
          {/* <Input
            label="URL Foto Profil (Opsional)"
            placeholder="https://..."
            value={formData.imageProfile}
            onChange={(e) =>
              setFormData({ ...formData, imageProfile: e.target.value })
            }
          /> */}

          {/* Select Role */}
          {/* <Select
            label="Role Akses"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { label: "Administrator", value: "ADMIN" },
              { label: "Staff Operasional", value: "STAFF" },
            ]}
          /> */}

          <div className="pt-2 space-y-4">
            <Button type="submit" className="w-full" isLoading={loading}>
              Daftarkan Sekarang
            </Button>

            <Link
              to="/users"
              className="flex items-center justify-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
              <ArrowLeft size={16} /> Kembali ke Manajemen User
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { LogIn, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const { loginAction, loading } = useAuth();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const success = await loginAction(formData);

      if (success) {
        toast.success("Login Berhasil")
        navigate("/");
      } else {
        console.error("❌ [Login] Gagal, cek respon server di Network Tab.");
        toast.error("Gagal Login Bre")
      }
    } catch (err) {
      console.error("🔥 [Login] Error Fatal:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-200/50 dark:shadow-none">
        {/* Logo/Icon */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 animate-bounce-slow">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Welcome Back, Bre!
          </h1>
          <p className="text-sm text-neutral-500">
            Masukin akses lu buat masuk ke Mabes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
          </div>

          <Button
            type="submit"
            className="w-full py-6 text-lg"
            isLoading={loading}>
            <LogIn size={20} /> Masuk Sekarang
          </Button>
        </form>

        <p className="text-center text-xs text-neutral-400">
          Lupa password? Hubungi Developer Pusat, Bre.
        </p>
      </div>
    </div>
  );
};

export default Login;

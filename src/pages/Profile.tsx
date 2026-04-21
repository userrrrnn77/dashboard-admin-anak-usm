import { useRef, useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { uploadToCloudinary } from "../utils/uploadCloudinary";
import {
  ShieldCheck,
  LogOut,
  Save,
  UserCircle,
  Phone,
  Camera,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "../api/user";

const Profile = () => {
  const { user, logoutAction, fetchMe } = useAuth();

  // Ambil ID dengan segala cara (antisipasi _id atau id)
  const userId = (user as User)?._id;

  const { updateUser, isUpdating } = useUser(userId);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    password: "", // Password kosongin aja biar kaga nampilin hash
  });

  // Sinkronisasi data kalau user baru login/data baru masuk
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        password: "",
      });
    }
  }, [user]);

  // --- HANDLER UPLOAD FOTO ---
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      console.log("🔍 Ngecek ID pas upload:", userId); // Pastiin ini muncul

      if (!file) return;
      if (!userId) {
        toast.error("UserID masih kosong, tunggu bentar atau refresh!");
        return;
      }

      setIsUploading(true);
      const toastId = toast.loading("Lagi nembak Cloudinary...");

      try {
        const res = await uploadToCloudinary(file);
        if (!res.secure_url) throw new Error("Gagal dapet URL Cloudinary");

        await updateUser({
          id: userId,
          data: { imageProfile: res.secure_url } as Partial<User>,
        });

        await fetchMe();
        toast.success("Foto profil dipoles!", { id: toastId });
      } catch (err: unknown) {
        console.error("ERRORNYA:", err);
        if (err instanceof Error) {
          toast.error(`Gagal: ${err.message}`, { id: toastId });
        } else {
          toast.error("Gagal update, cek console!", { id: toastId });
        }
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [userId, updateUser, fetchMe],
  ); // WAJIB ada userId di sini, Bre!

  // --- HANDLER UPDATE DATA ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      // Kirim data, kalau password kosong hapus aja dari payload biar kaga ganti password
      const payload: Partial<User & { password?: string }> = { ...formData };
      if (!payload.password) {
        delete payload.password;
      }

      await updateUser({
        id: userId,
        data: payload as User, // Cast ke User karena interface API lu biasanya minta itu
      });
      toast.success("Data berhasil diupdate, Bre!");
      await fetchMe();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div key={userId} className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* HEADER */}
      <div className="relative bg-white dark:bg-neutral-900 rounded-[3rem] p-8 border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <Badge variant={user?.role === "ADMIN" ? "danger" : "success"}>
            {user?.role || "MEMBER"}
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div
              onClick={handleAvatarClick}
              className={`w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-indigo-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 overflow-hidden cursor-pointer ${isUploading ? "animate-pulse" : ""}`}>
              {isUploading ? (
                <Loader2 size={40} className="animate-spin text-white/70" />
              ) : user?.imageProfile ? (
                <img
                  src={user.imageProfile}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <UserCircle
                  size={80}
                  strokeWidth={1.5}
                  className="group-hover:scale-110 transition-transform duration-500"
                />
              )}
            </div>

            {!isUploading && (
              <div
                onClick={handleAvatarClick}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-[2px]">
                <Camera size={24} className="mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Ganti Foto
                </span>
              </div>
            )}
          </div>

          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white">
              {user?.name || "Anonymous"}
            </h1>
            <p className="text-neutral-500 font-medium flex items-center justify-center md:justify-start gap-2 text-sm">
              <Phone size={14} /> {user?.phone || "Kaga ada nomor"}
            </p>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-full text-[10px] font-black text-indigo-500 uppercase tracking-widest w-fit mx-auto md:mx-0">
              <ShieldCheck size={12} /> Verified System
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Button
            onClick={logoutAction}
            className="w-full justify-start py-6 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 border-none transition-all">
            <LogOut size={20} className="mr-3" /> Logout Akun
          </Button>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <Input
                  label="Nomor WhatsApp"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />

                <Input
                  label="Ganti Password (Kosongkan jika tidak ingin ganti)"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full py-7 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20"
                isLoading={isUpdating}>
                <Save size={20} className="mr-2" /> Simpan Perubahan
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

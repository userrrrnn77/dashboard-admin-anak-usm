import { useState, useCallback } from "react";
import {
  login as loginapi,
  logout as logoutapi,
  registerUser as registerapi,
  getMe as getMeapi,
} from "../api/auth";
import { useAuthStore, type UserProfile } from "../store/authStore";
import { toast } from "sonner";
import { AxiosError } from "axios";

// --- Types & Interfaces ---
interface LoginPayload {
  phone: string;
  password: string;
}

interface GetMeResponse {
  success: boolean;
  user: {
    _id: string;
    id?: string;
    name: string;
    phone: string;
    role: string;
    imageProfile?: string;
    [key: string]: unknown; // Jaga-jaga kalo ada field lain dari backend
  };
}

interface RegisterPayload {
  name: string;
  phone: string;
  password?: string;
  role: string;
  imageProfile?: string;
}

interface ErrorResponse {
  message: string;
}

interface LoginSuccessData {
  user: UserProfile;
  token: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  // Ambil actions dari store
  const { setauth, clearauth, setuser } = useAuthStore((s) => s.actions);
  const user = useAuthStore((s) => s.user);

  // 1. LOGIN ACTION
  const loginAction = async (payload: LoginPayload): Promise<boolean> => {
    setLoading(true);
    try {
      const { data } = await loginapi(payload);

      console.log("📦 [useAuth] Data dari server:", data);

      // Kita cast 'data' langsung ke LoginSuccessData karena backend kaga pake bungkus 'data' lagi
      const authData = data as unknown as LoginSuccessData;

      if (data.success && authData.token && authData.user) {
        // Sekarang ini pasti ketemu nilainya, kaga bakal undefined!
        setauth(authData.user, authData.token);
        toast.success("Login Berhasil, Bre! Selamat datang di Mabes.");
        return true;
      }

      return false;
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      const msg = error.response?.data?.message || "Login Gagal, Bgsd!";
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 2. REGISTER ACTION
  const registerAction = async (payload: RegisterPayload): Promise<boolean> => {
    setLoading(true);
    try {
      const { data } = await registerapi(payload);
      if (data.success) {
        toast.success(`User ${payload.name} Berhasil Didaftarin!`);
        return true;
      }
      return false;
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.message || "Gagal Daftar, Bre!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 3. FETCH ME (SINKRONISASI PROFIL)
  const fetchMe = useCallback(async () => {
    try {
      // Kasih tau TS kalau 'data' itu bentuknya GetMeResponse
      const response = await getMeapi();
      const data = response.data as GetMeResponse;

      console.log("🔥 DATA DARI API GETME:", data);

      if (data.success && data.user) {
        setuser({
          ...data.user,
          // Sekarang TS kaga bakal protes lagi karena _id udah ada di GetMeResponse
          _id: data.user._id || data.user.id || "",
        } as UserProfile);
      }
    } catch (err) {
      console.error("Gagal sinkron, Bre:", err);
    }
  }, [setuser]);

  // 4. LOGOUT ACTION
  const logoutAction = async (): Promise<void> => {
    try {
      await logoutapi();
    } catch {
      // Abaikan error api pas logout
    } finally {
      clearauth();
      window.location.href = "/login";
    }
  };

  return {
    loginAction,
    registerAction,
    fetchMe,
    logoutAction,
    loading,
    user,
  };
};

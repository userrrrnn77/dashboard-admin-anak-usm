import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_CORE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// 📍 Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Di Web pake localStorage, kaga perlu await bre, dia synchronous!
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 📍 Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Bersihin local storage
      localStorage.removeItem("userToken");
      localStorage.removeItem("user-storage"); // Kalo pake zustand persist

      // Kasih tau user pake Toast biar elit
      toast.error("Sesi Berakhir", {
        description:
          "Akun tidak ditemukan atau token kadaluarsa. Silahkan login ulang.",
      });

      // Redirect ke login kalo perlu
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

export interface ResponseBre<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

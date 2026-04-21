import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  _id: string;
  name: string;
  phone: string;
  role: string;
  imageProfile?: string;
  password: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isauthenticated: boolean;
  actions: {
    setauth: (user: UserProfile, token: string) => void;
    setuser: (user: UserProfile) => void; // Pintu resmi buat update profil
    clearauth: () => void;
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isauthenticated: false,
      actions: {
        setauth: (user, token) => set({ user, token, isauthenticated: true }),

        // Update profil doang tanpa nendang token
        setuser: (user) => set({ user }),

        clearauth: () =>
          set({ user: null, token: null, isauthenticated: false }),
      },
    }),
    {
      name: "bre-auth-storage",
      // Kita cuma simpen data mentah, actions kaga usah ikut masuk storage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isauthenticated: state.isauthenticated,
      }),
    },
  ),
);

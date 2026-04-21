import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUser,
  deleteUser,
  getUserById,
  acceptedRegister,
  getAllRegistration,
  getRegistrationById,
  deleteRegistrationById,
  updateUser, // tolong tambahin dua ini bre
  createUser,
  type User, // tolong tambahin dua ini bre
} from "../api/user";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

// 🏛️ Interface buat Jenderal TS biar kaga tantrum lagi
export interface RegistrationData {
  _id: string; // ID dari MongoDB
  fullName: string;
  birthPlace: string;
  birthDate: string | Date; // Di Frontend biasanya jadi string ISO pas ditarik, tapi kita fleksibel aja
  gender: "Laki-laki" | "Perempuan";
  addressKTP: string;
  addressDomisili: string;
  phoneNumber: string;
  ktpNumber: string;
  occupation:
    | "Karyawan"
    | "Peg. Negeri"
    | "TNI/POLRI"
    | "Pedagang/Wirausaha"
    | "Manajer"
    | "Profesional"
    | "Pelajar/Mahasiswa"
    | "Lainnya";
  maritalStatus: "Lajang" | "Menikah" | "Janda" | "Duda";
  education: "SD/SMP" | "SMA" | "Akademi/D-3/S1" | "S2/S3";
  religion: "Islam" | "Kristen/Katholik" | "Hindu" | "Budha";
  monthlyIncome:
    | "< Rp. 500.000,-"
    | "Rp. 500.000 - 1.000.000"
    | "Rp. 1 - 2 juta"
    | "Rp. 2 - 3 juta"
    | "Rp. 3 - 4 juta"
    | "Rp. 4 - 5 juta"
    | "Rp. 5 - 6 juta"
    | "> Rp. 6.000.000,-";
  selectedProduct:
    | "SIRELA"
    | "Simpanan Syariah"
    | "SAJAAH"
    | "Simpanan Hasanah"
    | "SISUQUR"
    | "SIAROFAH"
    | "SISIDIK"
    | "SIMAPAN"
    | "SIHARA"
    | "SIZawa";
  initialDeposit: number;
  isVerified: boolean;
  heirName?: string;
  heirAddress?: string;
  createdAt?: string; // Dari timestamps
  updatedAt?: string; // Dari timestamps
}
export const useUser = (userId?: string, registrationId?: string) => {
  const queryClient = useQueryClient();

  // --- 1. DATA FETCHING (GET ALL) ---

  // Semua User
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getAllUser,
  });

  // Semua Pendaftar (Registrasi)
  const registrationsQuery = useQuery({
    queryKey: ["registrations"],
    queryFn: getAllRegistration,
  });

  // --- 2. DATA FETCHING (GET BY ID) ---

  // Detail User Spesifik
  const userDetailQuery = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  // Detail Registrasi Spesifik
  const regDetailQuery = useQuery({
    queryKey: ["registrations", registrationId],
    queryFn: () => getRegistrationById(registrationId!),
    enabled: !!registrationId,
  });

  // --- 3. MUTATIONS (ACTIONS) ---
  // 🚀 CREATE USER
  const createAction = useMutation({
    mutationFn: (data: User) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User baru resmi mendarat!");
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.message || "Gagal bikin user baru!");
    },
  });

  // 🪄 UPDATE USER
  const updateAction = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => // The expected type comes from property 'data' which is declared here on type '{ id: string; data: User<string>; }'
    // udah gw gituin masih gitu bre anjir
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["users", userId] });
      }
      toast.success("Data user berhasil dipoles!");
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.message || "Gagal update data user!");
    },
  });

  const deleteAction = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User berhasil dimusnahkan, Bre!");
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.message || "Gagal hapus user!");
    },
  });

  const approveAction = useMutation({
    mutationFn: (id: string) => acceptedRegister(id),
    onSuccess: () => {
      // Invalidate keduanya biar sinkron
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      toast.success("Pendaftar resmi di-ACC!");
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.message || "Gagal ACC pendaftar!");
    },
  });

  const deleteRegistration = useMutation({
    // 1. Pastiin namanya bener, sesuaikan ama API service lu
    mutationFn: (id: string) => deleteRegistrationById(id),

    onSuccess: async () => {
      // Refresh list (WAJIB)
      await queryClient.invalidateQueries({ queryKey: ["registrations"] });

      // Refresh detail pake registrationId dari parameter hook
      if (registrationId) {
        queryClient.invalidateQueries({
          queryKey: ["registrations", registrationId],
        });
      }

      toast.success("Dah ilang, Bre!");
    },

    onError: (err: unknown) => {
      const error = err as AxiosError<ErrorResponse>;
      toast.error(error.response?.data?.message || "Gagal ACC pendaftar!");
    },
  });

  return {
    // Data Lists
    users: usersQuery.data?.data?.data || [],
    registrations:
      (registrationsQuery.data?.data?.data as RegistrationData[]) || [],

    // Data Details
    userDetail: userDetailQuery.data?.data?.data || null,
    registrationDetail:
      (regDetailQuery.data?.data?.data as RegistrationData) || null,

    // Status
    isLoading: usersQuery.isLoading || registrationsQuery.isLoading,
    isDetailLoading: userDetailQuery.isLoading || regDetailQuery.isLoading,
    isCreating: createAction.isPending,
    isUpdating: updateAction.isPending,
    isDeleting: deleteAction.isPending,
    isApproving: approveAction.isPending,

    // Actions
    createUser: createAction.mutateAsync, // Pake Async biar lu bisa handle .then() di form
    updateUser: updateAction.mutateAsync,
    deleteRegistration: deleteRegistration.mutate,
    deleteUser: deleteAction.mutate,
    approveUser: approveAction.mutate,
  };
};

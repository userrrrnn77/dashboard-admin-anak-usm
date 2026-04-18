import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUser,
  deleteUser,
  getUserById,
  acceptedRegister,
  getAllRegistration,
  getRegistrationById,
} from "../api/user";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
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

  return {
    // Data Lists
    users: usersQuery.data?.data?.data || [],
    registrations: registrationsQuery.data?.data?.data || [],

    // Data Details
    userDetail: userDetailQuery.data?.data?.data || null,
    registrationDetail: regDetailQuery.data?.data?.data || null,

    // Status
    isLoading: usersQuery.isLoading || registrationsQuery.isLoading,
    isDetailLoading: userDetailQuery.isLoading || regDetailQuery.isLoading,

    // Actions
    deleteUser: deleteAction.mutate,
    approveUser: approveAction.mutate,
    isDeleting: deleteAction.isPending,
    isApproving: approveAction.isPending,
  };
};

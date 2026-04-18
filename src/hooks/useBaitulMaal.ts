import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProgram,
  deleteProgram,
  getProgramById,
  createProgram,
  updateProgram,
  type CreateBaitulMaal,
} from "../api/baitulMaal";
import { toast } from "sonner";

export const useBaitulMaal = (id?: string) => {
  const queryClient = useQueryClient();

  // GET ALL & GET BY ID
  const { data: programs, isLoading } = useQuery({
    queryKey: ["baitul-maal"],
    queryFn: getAllProgram,
  });

  const { data: program } = useQuery({
    queryKey: ["baitul-maal", id],
    queryFn: () => getProgramById(id!),
    enabled: !!id,
  });

  // CREATE
  const createAction = useMutation({
    mutationFn: createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["baitul-maal"] });
      toast.success("Program baru meluncur!");
    },
  });

  // UPDATE
  const updateAction = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateBaitulMaal }) =>
      updateProgram(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["baitul-maal"] });
      toast.success("Program berhasil di-update!");
    },
  });

  const deleteAction = useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["baitul-maal"] });
      toast.success("Program dihapus!");
    },
  });

  return {
    programs: programs?.data?.data || [],
    program: program?.data?.data || null,
    isLoading,
    createProgram: createAction.mutateAsync,
    updateProgram: updateAction.mutateAsync,
    deleteProgram: deleteAction.mutate,
  };
};

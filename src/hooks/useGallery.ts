import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllGallery, deleteGallery, createGallery } from "../api/gallery";
import { toast } from "sonner";

export const useGallery = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: getAllGallery,
  });

  const createAction = useMutation({
    mutationFn: createGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Foto masuk galeri!");
    },
  });

  const deleteAction = useMutation({
    mutationFn: (id: string) => deleteGallery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Foto dihapus dari galeri!");
    },
  });

  return {
    images: data?.data?.data || [],
    isLoading,
    addPhoto: createAction.mutateAsync,
    deleteImage: deleteAction.mutate,
  };
};

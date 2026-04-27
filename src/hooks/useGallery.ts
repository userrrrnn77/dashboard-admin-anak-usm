import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllGallery,
  deleteGallery,
  createGallery,
  type IGalleryPayload,
} from "../api/gallery";
import { toast } from "sonner";

export const useGallery = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: getAllGallery,
  });

  const items = (data?.data?.data as IGalleryPayload[]) || [];

  const createAction = useMutation({
    mutationFn: createGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Konten masuk galeri!");
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
    items: items,
    isLoading,
    addPhoto: createAction.mutateAsync,
    deleteImage: deleteAction.mutate,
  };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addCarousel,
  deleteCarousel,
  getAllCarousel,
  type ICarousel as carousel,
} from "../api/carousel";
import { toast } from "sonner";

export const useCarousel = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["carousel"],
    queryFn: getAllCarousel,
  });

  const carousels = (data?.data?.data as carousel[]) || [];

  const createCarousel = useMutation({
    mutationFn: addCarousel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] });
      toast.success("Carousel Berhasil Upload bre");
    },
  });

  const deleteAction = useMutation({
    mutationFn: (id: string) => deleteCarousel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] });
      toast.success("Carousel Berhasil Di Hapus bre");
    },
  });

  return {
    carousels: carousels,
    isLoading,
    addCarousel: createCarousel.mutateAsync,
    deleteCarousel: deleteAction.mutate,
  };
};

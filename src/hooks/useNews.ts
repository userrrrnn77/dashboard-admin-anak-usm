// src/hooks/useNews.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllNews,
  getNewsBySlug,
  createNews,
  deleteNews,
  type INews,
} from "../api/news";
import { toast } from "sonner";

export const useNews = (slug?: string) => {
  const queryClient = useQueryClient();

  // 1. GET ALL NEWS (Kita casting as INews[] biar TS tau ini FIX ARRAY!)
  const { data: newsList, isLoading: isNewsLoading } = useQuery({
    queryKey: ["news-list"],
    queryFn: async () => {
      const response = await getAllNews();
      return (response.data.data || []) as INews[]; // 🚀 Kunci kasta tertinggi di sini!
    },
  });

  // 2. GET NEWS BY SLUG
  const { data: newsDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ["news-detail", slug],
    queryFn: async () => {
      const response = await getNewsBySlug(slug!);
      return response.data.data;
    },
    enabled: !!slug,
  });

  // 3. CREATE NEWS
  const createAction = useMutation({
    mutationFn: (data: INews) => createNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-list"] });
      toast.success("Berita berhasil dipublikasikan, Bre!");
    },
    onError: () => {
      toast.error("Gagal menyimpan berita baru.");
    },
  });

  // 4. DELETE NEWS
  const deleteAction = useMutation({
    mutationFn: (id: string) => deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-list"] });
      toast.success("Berita telah dihapus dari sistem.");
    },
    onError: () => {
      toast.error("Gagal menghapus berita.");
    },
  });

  return {
    newsList: (newsList || []) as INews[], 
    newsDetail: newsDetail || null,
    isLoading: isNewsLoading || isDetailLoading,
    createNews: createAction.mutateAsync,
    deleteNews: deleteAction.mutate,
  };
};

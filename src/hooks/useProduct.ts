import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProduct,
  deleteProduct,
  createProduct,
  updateProduct,
  type product,
} from "../api/product";
import {
  getDetailProductById,
  createProductDetail,
  updateProductDetail,
  deleteProductDetail,
  type productDetail,
} from "../api/productDetail";
import { toast } from "sonner";

// Interface untuk Update Param (Steril & Strict)
interface UpdateProductParams {
  id: string;
  data: Partial<product>;
}

interface UpdateDetailParams {
  id: string;
  data: Partial<productDetail>;
}

export const useProduct = (productId?: string) => {
  const queryClient = useQueryClient();

  // --- 1. DATA FETCHING (GET) ---
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });

  const detailQuery = useQuery({
    queryKey: ["product-detail", productId],
    queryFn: () => getDetailProductById(productId!),
    enabled: !!productId,
  });

  // --- 2. PRODUCT MUTATIONS (Utama) ---
  const createProductAction = useMutation({
    mutationFn: (data: product) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk baru meluncur, Bre!");
    },
  });

  const updateProductAction = useMutation({
    mutationFn: ({ id, data }: UpdateProductParams) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil diperbarui!");
    },
  });

  const deleteProductAction = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk resmi dibuang!");
    },
  });

  // --- 3. PRODUCT DETAIL MUTATIONS (Sub-Logic) ---
  const createDetailAction = useMutation({
    mutationFn: (data: productDetail) => createProductDetail(data),
    onSuccess: () => {
      if (productId) {
        queryClient.invalidateQueries({
          queryKey: ["product-detail", productId],
        });
      }
      toast.success("Detail produk berhasil dirakit!");
    },
  });

  const updateDetailAction = useMutation({
    mutationFn: ({ id, data }: UpdateDetailParams) =>
      updateProductDetail(id, data),
    onSuccess: (_, variables) => {
      // Pake 'variables.id' biar TS kaga pusing nyari 'id'
      queryClient.invalidateQueries({
        queryKey: ["product-detail", variables.id],
      });
      toast.success("Detail produk diperbarui!");
    },
  });

  const deleteDetailAction = useMutation({
    mutationFn: (id: string) => deleteProductDetail(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["product-detail", id] });
      toast.success("Detail produk dimusnahkan!");
    },
  });

  return {
    // --- Data ---
    products: productsQuery.data?.data?.data || [],
    productDetail: detailQuery.data?.data?.data || null,

    // --- Status ---
    isLoading: productsQuery.isLoading || detailQuery.isLoading,
    isActionLoading:
      createProductAction.isPending ||
      updateProductAction.isPending ||
      deleteProductAction.isPending,

    // --- Actions (Product Utama) ---
    createProduct: createProductAction.mutateAsync,
    updateProduct: updateProductAction.mutateAsync,
    deleteProduct: deleteProductAction.mutate,

    // --- Actions (Detail) ---
    createDetail: createDetailAction.mutateAsync,
    updateDetail: updateDetailAction.mutateAsync,
    deleteDetail: deleteDetailAction.mutate,
  };
};

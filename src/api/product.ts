import api, { type ResponseBre } from "./axios";

export const getAllProduct = () => api.get<ResponseBre>("/product");

export const getProductFullById = (id: string) =>
  api.get(`/product/full/${id}`);

export interface product {
  title?: string;
  fullTitle?: string;
  desc?: string;
  icon?: string;
  image?: string;
  publicId?: string; // <--- WAJIB TAMBAHIN INI, BRE!
  category?: "simpanan" | "pembiayaan";
}

export const createProduct = (data: product) =>
  api.post<ResponseBre>("/product", data);

export const updateProduct = (id: string, data: Partial<product>) =>
  api.post<ResponseBre>(`/product/${id}`, data);

export const deleteProduct = (id: string) =>
  api.delete<ResponseBre>(`/product/${id}`);

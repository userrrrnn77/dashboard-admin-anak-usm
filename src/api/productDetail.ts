import api, { type ResponseBre } from "./axios";

export interface ISection {
  subtitle: string;
  items: string[];
}

export interface productDetail {
  id?: string;
  title?: string;
  description?: string;
  sections?: ISection[];
}

export const getDetailProductById = (id: string) =>
  api.get<ResponseBre>(`/prduct-detail/${id}`);

export const createProductDetail = (data: productDetail) =>
  api.post("/product-detail", data);

export const updateProductDetail = (id: string, data: Partial<productDetail>) =>
  api.post<ResponseBre>(`/product-detail/${id}`, data);

export const deleteProductDetail = (id: string) =>
  api.delete<ResponseBre>(`/product-detail/${id}`);

import api, { type ResponseBre } from "./axios";

export const getAllGallery = () => api.get<ResponseBre>("/gallery");

export interface gallery {
  _id?: string;
  src?: string;
  alt?: string;
  category?: string;
  publicId?: string;
}

export const createGallery = (data: gallery) =>
  api.post<ResponseBre>("/gallery", data);

export const deleteGallery = (id: string) => api.delete(`/gallery/${id}`);

import api, { type ResponseBre } from "./axios";

export const getAllGallery = () => api.get<ResponseBre>("/gallery");

export interface gallery {
  _id?: string;
  src?: string;
  alt?: string;
  type?: "image" | "video";
  category?: string;
  publicId?: string;
}

export interface IGalleryPayload {
  items: gallery[]
}

export const createGallery = (data: IGalleryPayload) =>
  api.post<ResponseBre>("/gallery", data);

export const deleteGallery = (id: string) => api.delete(`/gallery/${id}`);

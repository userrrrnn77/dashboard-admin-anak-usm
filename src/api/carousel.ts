import api, { type ResponseBre } from "./axios";

export interface ICarousel {
  _id?: string;
  image?: string;
  title?: string;
  publicId?: string;
}

export const addCarousel = (data: ICarousel) =>
  api.post<ResponseBre>("/carousel", data);

export const getAllCarousel = () => api.get<ResponseBre>("/carousel");

export const deleteCarousel = (id: string) =>
  api.delete<ResponseBre>(`/carousel/${id}`);

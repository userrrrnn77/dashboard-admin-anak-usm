import api, { type ResponseBre } from "./axios";

export interface INews {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  images: string[];
  category: string;
}

export const createNews = (data: INews) => api.post<ResponseBre>("/news", data);

export const getAllNews = () => api.get<ResponseBre>("/news");

export const getNewsBySlug = (slug: string) =>
  api.get<ResponseBre>(`/news/:${slug}`);

export const deleteNews = (id: string) =>
  api.delete<ResponseBre>(`/news/:${id}`);

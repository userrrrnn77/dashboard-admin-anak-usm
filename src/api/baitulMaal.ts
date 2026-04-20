import api, { type ResponseBre } from "./axios";

export const getAllProgram = () => api.get<ResponseBre>("/baitul-maal");

export const getProgramById = (id: string) =>
  api.get<ResponseBre>(`/baitul-maal/${id}`);

export interface CreateBaitulMaal {
  title?: string;
  tagline?: string;
  description?: string;
  images?: string[];
  publicIds?: string[];
  videoUrl?: string[];
  features?: string[];
  category: "KESEHATAN" | "KEMANUSIAAN" | "SOSIAL";
}

export const createProgram = (data: CreateBaitulMaal) =>
  api.post<ResponseBre>("/baitul-maal", data);

export const updateProgram = (id: string, data: Partial<CreateBaitulMaal>) =>
  api.patch<ResponseBre>(`/baitul-maal/${id}`, data);

export const deleteProgram = (id: string) => api.delete(`/baitul-maal/${id}`);

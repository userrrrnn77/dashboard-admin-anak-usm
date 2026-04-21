import api, { type ResponseBre } from "./axios";

export interface User {
  _id:string;
  name?: string;
  phone?: string;
  password?: string;
  role: string;
  imageProfile?: string;
}

// =============================
// RUTE USER ATAU KARYAWAN
// =============================

export const createUser = (data: User) =>
  api.post<ResponseBre>("/user/createUser", data);

export const getAllUser = () => api.get<ResponseBre>("/user");

export const getUserById = (id: string) => api.get<ResponseBre>(`/user/${id}`);

export const updateUser = (id: string, data: Partial<User>) =>
  api.patch<ResponseBre>(`/user/${id}`, data);

export const deleteUser = (id: string) =>
  api.delete<ResponseBre>(`/user/${id}`);

// ==============================
// RUTE PENDAFTAR BRE
// ==============================

// acc pendaftar bre
export const acceptedRegister = (id: string) =>
  api.patch(`/registration/verify/${id}`);

export const getAllRegistration = () => api.get<ResponseBre>("/registration");

export const getRegistrationById = (id: string) =>
  api.get<ResponseBre>(`/registration/${id}`);

export const deleteRegistrationById = (id: string) =>
  api.delete<ResponseBre>(`/registration/${id}`);

import api, { type ResponseBre } from "./axios";

export interface User<String = string> {
  name?: String;
  phone?: String;
  password?: String;
  role: String;
  imageProfile?: String;
}

export const createUser = (data: User) =>
  api.post<ResponseBre>("/user/createUser", data);

export const getAllUser = () => api.get<ResponseBre>("/user");

export const getUserById = (id: string) => api.get<ResponseBre>(`/user/${id}`);

export const updateUser = (id: string, data: Partial<User>) =>
  api.patch<ResponseBre>(`/user/${id}`, data);

export const deleteUser = (id: string) =>
  api.delete<ResponseBre>(`/user/${id}`);

// ==============================
// REGISTRASI PENDAFTAR BRE
// ==============================

// acc pendaftar bre
export const acceptedRegister = (id: string) =>
  api.patch(`/registration/${id}`);

export const getAllRegistration = () => api.get<ResponseBre>("/registration");

export const getRegistrationById = (id: string) =>
  api.get<ResponseBre>(`/${id}`);

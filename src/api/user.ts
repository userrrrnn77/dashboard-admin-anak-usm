import api, { type ResponseBre } from "./axios";

interface User<String = string> {
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

// acc pendaftar bre
export const acceptedRegister = (id: string) =>
  api.patch(`/registration/${id}`);

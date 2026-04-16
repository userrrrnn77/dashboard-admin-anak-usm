import api, { type ResponseBre } from "./axios";

interface Register {
  name: string;
  phone: string;
  password?: string;
  role: string;
  imageProfile?: string;
}

export const registerUser = (data: Register) =>
  api.post<ResponseBre>("/auth/register", data);

interface Login {
  phone: string;
  password: string;
}

export const login = (data: Login) =>
  api.post<ResponseBre>("/auth/login", data);

export const getMe = () => api.get<ResponseBre>("/auth/me");

export const logout = () => api.post<ResponseBre>("/auth/logout");

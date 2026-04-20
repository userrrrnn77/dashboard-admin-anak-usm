// src/api/cloudinary.ts
import api from "./axios";

export interface CloudinarySignature {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
}

export const getCloudinarySignature = async () => {
  const res = await api.get<CloudinarySignature>("/cloudinary/signature");
  return res.data;
};

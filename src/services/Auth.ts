
import api from "@/libs/api";
import {RegisterRequest, RegisterResponse } from "@/types/register";

export const UserRegister = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>("/Auth/register", userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server cavabı gəlib
      throw new Error(error.response.data.message || "Qeydiyyat zamanı xəta baş verdi");
    } else {
      // Şəbəkə və ya başqa xəta
      throw new Error(error.message || "Serverə qoşulmaq mümkün olmadı");
    }
  }
};


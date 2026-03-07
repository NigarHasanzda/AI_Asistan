import api from "@/libs/api";
import { LoginRequest, LoginResponse } from "@/types/login";


export const UserLogin = async (
  loginData: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/Auth/login", loginData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Serverdən gələn xəta mesajı
      throw new Error(error.response.data.message || "Login zamanı xəta baş verdi");
    } else {
      // Şəbəkə və ya digər xəta
      throw new Error(error.message || "Serverə qoşulmaq mümkün olmadı");
    }
  }
};
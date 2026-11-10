import api from "@/services/api";
import { LoginRequest, LoginResponse } from "@/types/login";

export const UserLogin = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    const { data } = await api.post<LoginResponse>("/Auth/login", loginData);

    if (data.token) localStorage.setItem("token", data.token);
    if (data.role !== undefined) localStorage.setItem("role", data.role.toString());

    return data;
  } catch (error: any) {
    if (!error.response) {
      throw new Error(error.message || "Serverə qoşulmaq mümkün olmadı");
    }
    throw new Error(error.response.data.message || "Login zamanı xəta baş verdi");
  }
};

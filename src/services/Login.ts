// services/Login.ts
import api from "@/libs/api";
import { LoginRequest, LoginResponse } from "@/types/login";

export const UserLogin = async (
  loginData: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/Auth/login", loginData);

    const { token, role } = response.data;

    if (token) localStorage.setItem("token", token);
    if (role !== undefined) localStorage.setItem("role", role.toString());

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Login zamanı xəta baş verdi");
    } else {
      throw new Error(error.message || "Serverə qoşulmaq mümkün olmadı");
    }
  }
};



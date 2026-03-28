
import api from "@/libs/api";
import { RegisterErrorResponse, RegisterRequest, RegisterSuccessResponse } from "@/types/register";
import { jwtDecode } from "jwt-decode";



export const UserRegister = async (
  userData: RegisterRequest
): Promise<RegisterSuccessResponse> => {
  try {
    const response = await api.post<RegisterSuccessResponse>(
      "/Auth/register",
      userData
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errData: RegisterErrorResponse = error.response.data;

      const message =
        errData?.title ||
        Object.values(errData?.errors || {})?.flat()?.[0] ||
        "Qeydiyyat zamanı xəta baş verdi";

      throw new Error(message);
    } else {
      throw new Error(error.message || "Serverə qoşulmaq mümkün olmadı");
    }
  }
};

interface DecodedToken {
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};


export const deleteAccount = async (): Promise<string> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token tapılmadı");
  }

  try {
    const response = await api.delete("/Auth/delete-account", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data || "Hesab uğurla silindi";
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Hesab silinərkən xəta baş verdi"
      );
    } else {
      throw new Error("Serverə qoşulmaq mümkün olmadı");
    }
  }
};
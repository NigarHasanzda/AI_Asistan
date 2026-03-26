
import api from "@/libs/api";
import {RegisterRequest, RegisterResponse } from "@/types/register";
import { jwtDecode } from "jwt-decode";



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
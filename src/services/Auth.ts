import api, { requireToken } from "@/services/api";
import { RegisterErrorResponse, RegisterRequest, RegisterSuccessResponse } from "@/types/register";
import { jwtDecode } from "jwt-decode";

const CONNECTION_ERROR = "Serverə qoşulmaq mümkün olmadı";

export const UserRegister = async (
  userData: RegisterRequest
): Promise<RegisterSuccessResponse> => {
  try {
    const { data } = await api.post<RegisterSuccessResponse>("/Auth/register", userData);
    return data;
  } catch (error: any) {
    if (!error.response) throw new Error(error.message || CONNECTION_ERROR);

    const errData: RegisterErrorResponse = error.response.data;
    const firstFieldError = Object.values(errData?.errors || {})?.flat()?.[0];

    throw new Error(
      errData?.title || firstFieldError || "Qeydiyyat zamanı xəta baş verdi"
    );
  }
};

interface DecodedToken {
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<DecodedToken>(token);
    return exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

export const deleteAccount = async (): Promise<string> => {
  requireToken();

  try {
    const { data } = await api.delete("/Auth/delete-account");
    return data || "Hesab uğurla silindi";
  } catch (error: any) {
    if (!error.response) throw new Error(CONNECTION_ERROR);
    throw new Error(error.response.data?.message || "Hesab silinərkən xəta baş verdi");
  }
};

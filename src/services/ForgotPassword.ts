import api from "@/services/api";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/types/forgotpassword";

/** Auth xətasını istifadəçiyə göstəriləcək mesaja çevirir. */
const toAuthError = (error: any, fallback: string): Error =>
  error.response
    ? new Error(error.response.data.message || fallback)
    : new Error(error.message || "Serverə qoşulmaq mümkün olmadı");

export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await api.post<ForgotPasswordResponse>("/Auth/forgot-password", data);
    return response.data;
  } catch (error: any) {
    throw toAuthError(error, "Email göndərərkən xəta baş verdi");
  }
};

export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  try {
    const response = await api.post<ResetPasswordResponse>("/Auth/reset-password", data);
    return response.data;
  } catch (error: any) {
    throw toAuthError(error, "Şifrə yeniləyərkən xəta baş verdi");
  }
};
